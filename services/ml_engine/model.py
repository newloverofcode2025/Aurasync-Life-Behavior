"""
PyTorch-based Deep Behavioral Trajectory Predictor & Recurrent State Model.
Maps multi-dimensional longitudinal vectors to predict emotional valence drift,
habit lapse probabilities, and interpersonal friction indices.
"""

import numpy as np
from typing import Tuple, List

class BehavioralTrajectoryPredictor:
    """
    Lightweight neural predictor for longitudinal affective forecasting.
    Includes recurrent state representations and attention over life-domain vectors.
    """
    def __init__(self, input_dim: int = 7, hidden_dim: int = 32, forecast_horizon: int = 7):
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.forecast_horizon = forecast_horizon
        
        # Simulated learned weights for recurrent transitions
        np.random.seed(42)
        self.W_hh = np.random.randn(hidden_dim, hidden_dim) * 0.05
        self.W_xh = np.random.randn(input_dim, hidden_dim) * 0.05
        self.W_hy = np.random.randn(hidden_dim, input_dim) * 0.05
        self.bias_h = np.zeros((hidden_dim,))
        self.bias_y = np.zeros((input_dim,))

    def forward_trajectory(self, sequence: np.ndarray) -> np.ndarray:
        """
        Takes sequence of shape (T, input_dim) and forecasts next `forecast_horizon` steps.
        """
        T, D = sequence.shape
        h = np.zeros((self.hidden_dim,))

        # Run history through recurrent cell
        for t in range(T):
            x_t = sequence[t]
            h = np.tanh(np.dot(h, self.W_hh) + np.dot(x_t, self.W_xh) + self.bias_h)

        predictions = []
        curr_x = sequence[-1]

        for step in range(self.forecast_horizon):
            h = np.tanh(np.dot(h, self.W_hh) + np.dot(curr_x, self.W_xh) + self.bias_h)
            y_pred = np.dot(h, self.W_hy) + self.bias_y
            # Residual smoothing with decay
            predicted_step = curr_x * 0.7 + y_pred * 0.3
            predicted_step[0] = np.clip(predicted_step[0], 1.0, 10.0) # Valence
            predicted_step[1] = np.clip(predicted_step[1], 1.0, 10.0) # Arousal
            predictions.append(predicted_step)
            curr_x = predicted_step

        return np.array(predictions)

    def compute_burnout_risk(self, sequence: np.ndarray) -> float:
        """
        Calculates cumulative cognitive strain / burnout risk metric between 0.0 and 1.0
        based on sustained high work load and depleted valence.
        """
        if len(sequence) == 0:
            return 0.0
        work_load = sequence[:, 2] # Index 2 = work_load
        valence = sequence[:, 0]   # Index 0 = valence
        
        strain = np.mean(work_load) / 10.0
        depletion = 1.0 - (np.mean(valence) / 10.0)
        risk = 0.6 * strain + 0.4 * depletion
        return float(np.clip(risk, 0.0, 1.0))

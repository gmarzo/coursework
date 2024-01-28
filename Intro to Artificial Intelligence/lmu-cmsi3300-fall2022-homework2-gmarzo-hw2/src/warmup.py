'''
warmup.py

Skeleton for answering warmup questions related to the
AdAgent assignment. By the end of this section, you should
be familiar with:
- Importing, selecting, and manipulating data using Pandas
- Creating and Querying a Bayesian Network
- Using Samples from a Bayesian Network for Approximate Inference

@author: <Garrett Marzo>
'''
import numpy as np
import pandas as pd

from pomegranate import *

if __name__ == '__main__':
    """
    PROBLEM 2.1
    Using the Pomegranate Interface, determine the answers to the
    queries specified in the instructions.
    
    ANSWER GOES BELOW:
    1. P(S|Ad1 = 0, Ad2 = 0) = ((0, 0.5210997268105008), (1, 0.18271609537196118), (2, 0.29618417781753803))
    2. P(S|G = 1, Ad1 = 0, Ad2 = 1) = ((0, 0.6042203715683895), (1, 0.07783401272929892), (2, 0.3179456157023116))
    3. P(S|T = 1, H = 1, Ad1 = 1, Ad2 = 0) = ((0, 0.29728928811552147), (1, 0.360204174806146), (2, 0.3425065370783326))

    """
    
    # TODO: 2.1
    adbot_data = pd.read_csv("../dat/adbot-data.csv")
    model = BayesianNetwork.from_samples(adbot_data, state_names=adbot_data.columns, algorithm='exact')
    results1 = model.predict_proba({"Ad1" : 0, "Ad2" : 0})[5].items()
    results2 = model.predict_proba({"Ad1" : 0, "Ad2" : 1, "G" : 1})[5].items()
    results3 = model.predict_proba({"T" : 1, "H" : 1, "Ad1" : 1, "Ad2" : 0})[5].items()
    print(adbot_data.to_numpy())
    #return
    

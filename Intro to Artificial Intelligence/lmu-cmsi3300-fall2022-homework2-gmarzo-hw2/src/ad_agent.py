'''
ad_engine.py
Advertisement Selection Engine that employs a Decision Network
to Maximize Expected Utility associated with different Decision
variables in a stochastic reasoning environment.

@author: Garrett Marzo
'''
import pandas as pd
from pomegranate import *
import math
import itertools
import unittest


class AdEngine:

    def __init__(self, data_file, dec_vars, util_map):
        """
        Responsible for initializing the Decision Network of the
        AdEngine using the following inputs
        
        :param string data_file: path to csv file containing data on which
        the network's parameters are to be learned
        :param list dec_vars: list of string names of variables to be
        considered decision variables for the agent. Example:
          ["Ad1", "Ad2"]
        :param dict util_map: discrete, tabular, utility map whose keys
        are variables in network that are parents of a utility node, and
        values are dictionaries mapping that variable's values to a utility
        score, for example:
          {
            "X": {0: 20, 1: -10}
          }
        represents a utility node with single parent X whose value of 0
        has a utility score of 20, and value 1 has a utility score of -10
        """
        # TODO! You decide the attributes and initialization of the network!
        self.util_map = util_map

        self.decision_nodes = {}
        self.chance_nodes = {}
        self.utility_node = util_map

        self.data = pd.read_csv(data_file)
        #print(self.data.to_numpy())
        self.bn_network = BayesianNetwork.from_samples(self.data, state_names=self.data.columns, algorithm='exact')
        #print(self.bn_network.structure)

        self.node_parents = {}


        for i in range(len(self.data.columns)):
            values = []
            self.node_parents.update({self.data.columns[i] : self.bn_network.structure[i]})
            for row in self.data.to_numpy():
                if row[i] in values:
                    continue
                else:
                    values.append(row[i])

            self.decision_nodes.update({self.data.columns[i] : values}) if self.data.columns[i] in dec_vars else self.chance_nodes.update({self.data.columns[i] : values})
        
        # print("DECISION: ", self.decision_nodes)
        # print("CHANCE: ", self.chance_nodes)
        # print("Node parents: ", self.node_parents)
        return
        

    def meu(self, evidence):
        """
        Given some observed demographic "evidence" about a potential
        consumer, selects the ad content that maximizes expected utility
        and returns a dictionary over any decision variables and their
        best values plus the MEU from making this selection.
        
        :param dict evidence: dict mapping network variables to their
        observed values, of the format: {"Obs1": val1, "Obs2": val2, ...}
        :return: 2-Tuple of the format (a*, MEU) where:
          - a* = dict of format: {"DecVar1": val1, "DecVar2": val2, ...}
          - MEU = float representing the EU(a* | evidence)
        """
        # TODO: Implement the above!

        #Label Vars

        query_vars = [self.data.columns[index] for index in self.node_parents.get(*list(self.utility_node.keys())) if self.data.columns[index] in self.chance_nodes]
        evidence_vars = evidence
        decision_vars = [*list(self.decision_nodes.keys())]
        unknown_vars = list(self.data.columns)
        #print(unknown_vars)
        for i in [*query_vars, *list(evidence_vars.keys()), *decision_vars, *list(self.utility_node.keys())]:
            unknown_vars.remove(i) if i in unknown_vars else None
        
        # print("Q: ", query_vars)
        # print("e: ", evidence_vars)
        # print("D: ", decision_vars)
        # print("Y: ", unknown_vars)
        
        #Find P(Q,e|D)
        print(self.bn_network.predict_proba(evidence))
        

        #Optimize summation order

        #Compute
        best_decisions, best_util = dict(), -math.inf
        return (best_decisions, best_util)


    def vpi(self, potential_evidence, observed_evidence):
        """
        Given some observed demographic "evidence" about a potential
        consumer, returns the Value of Perfect Information (VPI)
        that would be received on the given "potential" evidence about
        that consumer.
        
        :param string potential_evidence: string representing the variable name
        of the variable under evaluation
        :param dict observed_evidence: dict mapping network variables 
        to their observed values, of the format: {"Obs1": val1, "Obs2": val2, ...}
        :return: float value indicating the VPI(potential | observed)
        """
        # TODO: Implement the above!
        return 0
        

class AdAgentTests(unittest.TestCase):
    
    def test_meu_lecture_example_no_evidence(self):
        ad_engine = AdEngine('../dat/lecture5-2-data.csv', ["D"], {"Y": {0: 3, 1: 1}})
        evidence = {}
        decision = ad_engine.meu(evidence)
        self.assertEqual({"D": 0}, decision[0])
        self.assertAlmostEqual(2, decision[1], delta=0.01)
    
    def test_meu_lecture_example_with_evidence(self):
        ad_engine = AdEngine('../dat/lecture5-2-data.csv', ["D"], {"Y": {0: 3, 1: 1}})
        evidence = {"X": 0}
        decision = ad_engine.meu(evidence)
        self.assertEqual({"D": 1}, decision[0])
        self.assertAlmostEqual(2, decision[1], delta=0.01)
        
        evidence2 = {"X": 1}
        decision2 = ad_engine.meu(evidence2)
        self.assertEqual({"D": 0}, decision2[0])
        self.assertAlmostEqual(2.4, decision2[1], delta=0.01)
        
    def test_vpi_lecture_example_no_evidence(self):
        ad_engine = AdEngine('../dat/lecture5-2-data.csv', ["D"], {"Y": {0: 3, 1: 1}})
        evidence = {}
        vpi = ad_engine.vpi("X", evidence)
        self.assertAlmostEqual(0.24, vpi, delta=0.1)
    
    def test_meu_defendotron_no_evidence(self):
        ad_engine = AdEngine('../dat/adbot-data.csv', ["Ad1", "Ad2"], {"S": {0: 0, 1: 1776, 2: 500}})
        evidence = {}
        decision = ad_engine.meu(evidence)
        self.assertEqual({"Ad1": 1, "Ad2": 0}, decision[0])
        self.assertAlmostEqual(746.72, decision[1], delta=0.01)
        
    def test_meu_defendotron_with_evidence(self):
        ad_engine = AdEngine('../dat/adbot-data.csv', ["Ad1", "Ad2"], {"S": {0: 0, 1: 1776, 2: 500}})
        evidence = {"T": 1}
        decision = ad_engine.meu(evidence)
        self.assertEqual({"Ad1": 1, "Ad2": 1}, decision[0])
        self.assertAlmostEqual(720.73, decision[1], delta=0.01)
        
        evidence2 = {"T": 0, "G": 0}
        decision2 = ad_engine.meu(evidence2)
        self.assertEqual({"Ad1": 0, "Ad2": 0}, decision2[0])
        self.assertAlmostEqual(796.82, decision2[1], delta=0.01)
        
    def test_vpi_defendotron_no_evidence(self):
        ad_engine = AdEngine('../dat/adbot-data.csv', ["Ad1", "Ad2"], {"S": {0: 0, 1: 1776, 2: 500}})
        evidence = {}
        vpi = ad_engine.vpi("G", evidence)
        self.assertAlmostEqual(20.77, vpi, delta=0.1)
        
        vpi2 = ad_engine.vpi("F", evidence)
        self.assertAlmostEqual(0, vpi2, delta=0.1)
        
    def test_vpi_defendotron_with_evidence(self):
        ad_engine = AdEngine('../dat/adbot-data.csv', ["Ad1", "Ad2"], {"S": {0: 0, 1: 1776, 2: 500}})
        evidence = {"T": 0}
        vpi = ad_engine.vpi("G", evidence)
        self.assertAlmostEqual(25.49, vpi, delta=0.1)
        
        evidence2 = {"G": 1}
        vpi2 = ad_engine.vpi("P", evidence2)
        self.assertAlmostEqual(0, vpi2, delta=0.1)
        
        evidence3 = {"H": 0, "T": 1, "P": 0}
        vpi3 = ad_engine.vpi("G", evidence3)
        self.assertAlmostEqual(66.76, vpi3, delta=0.1)
        
if __name__ == '__main__':
    unittest.main()

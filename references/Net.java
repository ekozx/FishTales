package network;

import java.util.ArrayList;

public class Net {
	
	ArrayList<ArrayList<Neuron>> network;
	

	Net(ArrayList<Integer> topology){
		
		int numLayers = topology.size();
		network = new ArrayList<ArrayList<Neuron>>();
		
		for(int layerNum = 0; layerNum < numLayers; ++layerNum){
			network.add(new ArrayList<Neuron>());
			
			//Now we fill the layer with neurons
			//we loop <= since each layer has a bias neuron
			
			int numOutputs = layerNum == topology.size()-1 ? 0 : topology.get(layerNum+1);
			
			for(int neuronNum = 0; neuronNum<=topology.get(layerNum); ++neuronNum){
				//make a new Nueron
				network.get(network.size()-1).add(new Neuron(numOutputs, neuronNum));
			}
			//Force the bias nodes's output value to 1.0
			network.get(network.size()-1).get(network.get(network.size()-1).size()-1).setOutputVal(1.0);
			
		}
		
	}



	public void getResults(ArrayList<Double> resultVals){
		
		resultVals.clear();
		
		for(int n = 0; n < network.get(network.size()-1).size() - 1; ++n){
			resultVals.add(network.get(network.size()-1).get(n).getOutputVal());
		}
		
	}


	public void feedForward(ArrayList<Double> inputVals){
		
		assert(inputVals.size()==network.get(0).size() - 1);
		
		//Latch the input values into the input neurons
		
		for(int i= 0; i<inputVals.size(); ++i){
			network.get(0).get(i).setOutputVal(inputVals.get(i));
		}
		
		
		//Forward prop
		for(int layerNum = 1; layerNum < network.size(); ++layerNum){
			
			ArrayList<Neuron> prevLayer = network.get(layerNum - 1);
			
			for(int n=0; n<network.get(layerNum).size() - 1; ++n){
				network.get(layerNum).get(n).feedForward(prevLayer);
			}
		
		}
		
		
	}
	
	
	public void setWeights(ArrayList<Double> weights){
		
	}

}

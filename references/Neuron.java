package network;

import java.util.ArrayList;

public class Neuron {
	
	
	public class Connection
	{	
		public Connection(double weight){
			this.weight = weight;
		}
		public double weight;
		
	};
	
	public static final double eta = 0.39; //overall net learning rate
	public static final double alpha = 0.1; //momentum, multiplier of last deltaWeight

	double m_outputVal;
	double m_inputVal;
	ArrayList<Connection> m_outputWeights;
	int m_myIndex;
	double m_gradient;
	
	

	public Neuron(int numOutputs, int myIndex){
		

		
		for(int c=0; c<numOutputs; ++c){
			m_outputWeights.add(new Connection(1.0));
		}

		m_myIndex = myIndex;
		
	}
	
	public void setOutputVal(double val){ 
		m_outputVal = val; 
	}
	public double getOutputVal(){ 
		return m_outputVal; 
	}



	public double transferFunction(double x){
		
		return Math.tanh(x);

	}

	public void feedForward(ArrayList<Neuron> prevLayer){
		
		double sum = 0.0;
		
		//loop through all the previous layers outputs (which are our inputs)
		//include the bias neuron
		
		for(int n=0; n<prevLayer.size(); ++n){
			sum += prevLayer.get(n).getOutputVal() *
				 prevLayer.get(n).m_outputWeights.get(m_myIndex).weight;
		}

		//sum/=(prevLayer.size()/2.0);
		
		
		m_outputVal = transferFunction(sum);
		
	}

}

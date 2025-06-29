
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Shield, MessageSquare, Code, Flask } from 'lucide-react';
import Button from '@/components/Button';

const models = [
  {
    id: 'spam-detector',
    name: 'Spam Classifier',
    description: 'Classify text as spam or not spam',
    icon: Shield,
    route: '/chat/spam-detector',
    color: 'bg-red-500',
  },
  {
    id: 'gpt-2',
    name: 'GPT-2 Model',
    description: 'Text generation with GPT-2',
    icon: MessageSquare,
    route: '/chat/gpt-2',
    color: 'bg-blue-500',
  },
  {
    id: 'interpreter',
    name: 'Interpreter Model',
    description: 'Code interpretation and execution',
    icon: Code,
    route: '/chat/interpreter',
    color: 'bg-green-500',
  },
  {
    id: 'testing',
    name: 'Testing Model',
    description: 'Experimental testing model',
    icon: Flask,
    route: '/chat/testing',
    color: 'bg-purple-500',
  },
];

const ChatSelection = () => {
  const navigate = useNavigate();

  const handleModelSelect = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <Bot size={64} className="mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Choose Your AI Model</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the AI model that best fits your needs. Each model is specialized for different tasks and use cases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleModelSelect(model.route)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${model.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <model.icon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {model.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {model.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need help choosing? Each model is optimized for specific tasks to provide you with the best results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatSelection;

// components/LiveChat.tsx
"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'photographer';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'read';
};

type ChatStatus = 'offline' | 'online' | 'away';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis là pour répondre à toutes vos questions sur mes prestations de mariage. N'hésitez pas ! 😊",
      sender: 'photographer',
      timestamp: new Date(),
      status: 'read'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [showUserForm, setShowUserForm] = useState(true);
  const [chatStatus, setChatStatus] = useState<ChatStatus>('online');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions de questions rapides
  const quickQuestions = [
    "Êtes-vous disponible pour ma date ?",
    "Quels sont vos tarifs ?", 
    "Combien de photos vais-je recevoir ?",
    "Faites-vous les vidéos aussi ?",
    "Quels sont vos délais de livraison ?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulation de statut (en réalité, cela viendrait d'une API)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 18) {
      setChatStatus('online');
    } else if (hour >= 19 && hour <= 21) {
      setChatStatus('away');
    } else {
      setChatStatus('offline');
    }
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulation d'envoi et réponse automatique
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
      
      // Simulation de frappe
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        
        // Réponse automatique basique (en réalité connecté à un système de chat)
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          text: getAutoReply(text),
          sender: 'photographer',
          timestamp: new Date(),
          status: 'read'
        };
        
        setMessages(prev => [...prev, autoReply]);
      }, 2000);
    }, 1000);
  };

  const getAutoReply = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('tarif') || message.includes('prix') || message.includes('coût')) {
      return "Mes tarifs débutent à 890€ pour la formule Essentielle. Tout dépend de vos besoins ! Pouvez-vous me préciser votre date de mariage et le type de prestation souhaité ?";
    }
    
    if (message.includes('disponible') || message.includes('date')) {
      return "Pour vérifier ma disponibilité, pouvez-vous me donner votre date de mariage ? Je consulte mon planning et vous réponds immédiatement !";
    }
    
    if (message.includes('photo') && message.includes('nombre')) {
      return "Le nombre de photos dépend de la formule : 150-200 pour l'Essentielle, 300-400 pour la Classique, jusqu'à 800+ pour la Prestige. Toutes sont retouchées professionnellement !";
    }
    
    if (message.includes('vidéo') || message.includes('film')) {
      return "Oui, je propose également la vidéo ! Ma formule Complète à 1500€ inclut photo + vidéo par un seul professionnel. Sinon, toutes mes formules Premium et Prestige incluent de la vidéo cinématographique.";
    }
    
    if (message.includes('délai') || message.includes('livraison') || message.includes('recevoir')) {
      return "Les délais varient de 3-4 semaines (Essentielle) à 6-8 semaines (Prestige). Je propose aussi une livraison express de 50 photos sous 48h en option !";
    }
    
    return "Merci pour votre message ! Je vais vous répondre dans les plus brefs délais. En attendant, n'hésitez pas à consulter ma FAQ ou à me donner plus de détails sur votre projet de mariage ! 😊";
  };

  const handleUserInfoSubmit = () => {
    if (userInfo.name.trim()) {
      setShowUserForm(false);
      const welcomeMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `Parfait ${userInfo.name} ! Je suis ravi de pouvoir vous aider. Que puis-je faire pour vous aujourd'hui ?`,
        sender: 'photographer',
        timestamp: new Date(),
        status: 'read'
      };
      setMessages(prev => [...prev, welcomeMessage]);
    }
  };

  const getStatusColor = () => {
    switch (chatStatus) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (chatStatus) {
      case 'online': return 'En ligne';
      case 'away': return 'Absent temporairement';
      case 'offline': return 'Hors ligne';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
          title="Ouvrir le chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          
          {/* Badge de notification */}
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            1
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                📸
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor()} rounded-full border-2 border-white`}></div>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Photographe Mariage</h3>
              <p className="text-xs opacity-90">{getStatusText()}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {showUserForm ? (
          <div className="space-y-3">
            <div className="text-center text-sm text-gray-600 mb-4">
              Pour mieux vous aider, pouvez-vous me dire votre prénom ?
            </div>
            <input
              type="text"
              placeholder="Votre prénom"
              value={userInfo.name}
              onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              onKeyPress={(e) => e.key === 'Enter' && handleUserInfoSubmit()}
            />
            <input
              type="email"
              placeholder="Email (optionnel)"
              value={userInfo.email}
              onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              onKeyPress={(e) => e.key === 'Enter' && handleUserInfoSubmit()}
            />
            <button
              onClick={handleUserInfoSubmit}
              className="w-full bg-orange-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Commencer la discussion
            </button>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-2xl text-sm ${
                    message.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  {message.text}
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.sender === 'user' && (
                      <span className="ml-1">
                        {message.status === 'sending' && '⏳'}
                        {message.status === 'sent' && '✓'}
                        {message.status === 'read' && '✓✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Questions */}
      {!showUserForm && messages.length <= 3 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-2">Questions rapides :</div>
          <div className="flex flex-wrap gap-1">
            {quickQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => sendMessage(question)}
                className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-100 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      {!showUserForm && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(newMessage)}
            />
            <button
              onClick={() => sendMessage(newMessage)}
              disabled={!newMessage.trim()}
              className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {chatStatus === 'offline' && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              Je suis actuellement hors ligne. Je vous répondrai dès que possible !
            </div>
          )}
        </div>
      )}
    </div>
  );
}
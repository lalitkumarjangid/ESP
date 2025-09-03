'use client';

interface ESPBadgeProps {
  espType: string;
}

export const ESPBadge = ({ espType }: ESPBadgeProps) => {
  const getESPColor = (esp: string) => {
    const lowerEsp = esp.toLowerCase();
    
    if (lowerEsp.includes('gmail')) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (lowerEsp.includes('outlook') || lowerEsp.includes('microsoft')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (lowerEsp.includes('yahoo')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    } else if (lowerEsp.includes('amazon') || lowerEsp.includes('ses')) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    } else if (lowerEsp.includes('sendgrid')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (lowerEsp.includes('mailchimp')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (lowerEsp.includes('zoho')) {
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    } else if (lowerEsp.includes('mailgun')) {
      return 'bg-pink-100 text-pink-800 border-pink-200';
    } else if (lowerEsp.includes('icloud')) {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getESPIcon = (esp: string) => {
    const lowerEsp = esp.toLowerCase();
    
    if (lowerEsp.includes('gmail')) {
      return '📧';
    } else if (lowerEsp.includes('outlook') || lowerEsp.includes('microsoft')) {
      return '📨';
    } else if (lowerEsp.includes('yahoo')) {
      return '💌';
    } else if (lowerEsp.includes('amazon') || lowerEsp.includes('ses')) {
      return '📮';
    } else if (lowerEsp.includes('sendgrid')) {
      return '🔗';
    } else if (lowerEsp.includes('mailchimp')) {
      return '🐵';
    } else if (lowerEsp.includes('zoho')) {
      return '💼';
    } else if (lowerEsp.includes('mailgun')) {
      return '🔫';
    } else if (lowerEsp.includes('icloud')) {
      return '☁️';
    } else {
      return '📬';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getESPColor(espType)}`}>
      <span className="mr-1">{getESPIcon(espType)}</span>
      <span>{espType}</span>
    </div>
  );
};

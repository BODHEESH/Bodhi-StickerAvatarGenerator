'use client';

interface Style {
  id: string;
  name: string;
  description: string;
}

interface StyleSelectorProps {
  styles: Style[];
  selectedStyle: string;
  onStyleSelected: (styleId: string) => void;
}

export default function StyleSelector({ 
  styles, 
  selectedStyle, 
  onStyleSelected 
}: StyleSelectorProps) {
  return (
    <div className="space-y-4">
      {styles.map((style) => (
        <div 
          key={style.id}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedStyle === style.id 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-200 hover:border-primary-300'
          }`}
          onClick={() => onStyleSelected(style.id)}
        >
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="font-medium">{style.name}</h3>
              <p className="text-sm text-gray-500">{style.description}</p>
            </div>
            {selectedStyle === style.id && (
              <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

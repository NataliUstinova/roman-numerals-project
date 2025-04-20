export interface Conversion {
  _id: string;
  inputValue: string;
  convertedValue: string;
  type: 'arabic-to-roman' | 'roman-to-arabic';
  createdAt: string;
  __v: number;
}

interface ConversionHistoryProps {
  conversions: Conversion[];
  show: boolean;
}

const ConversionHistory: React.FC<ConversionHistoryProps> = ({
  conversions,
  show,
}) => {
  if (!show) return null;

  return (
    <div className="mt-6 border rounded-md overflow-hidden">
      <h3 className="font-medium text-gray-700 p-3 bg-gray-50 border-b">
        Conversion History
      </h3>
      <div className="max-h-60 overflow-y-auto">
        {conversions.length > 0 ? (
          conversions.map(conversion => (
            <div
              key={conversion._id}
              className="p-3 border-b last:border-b-0 hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <span className="font-medium">
                  {conversion.type === 'arabic-to-roman'
                    ? 'Number → Roman'
                    : 'Roman → Number'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(conversion.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-gray-600">{conversion.inputValue}</span>
                <span className="mx-2">→</span>
                <span className="text-indigo-600 font-medium">
                  {conversion.convertedValue}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-gray-500">
            No conversion history found
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionHistory;

import React from 'react';
import { BsTrash3Fill } from 'react-icons/bs';

const ExameList = ({ item }) => {
    return (
      <div className="bg-gray-50 rounded px-4 py-2">
        <div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700 font-light -mb-1">
              Exame:
            </p>
            <div
              className="text-sm text-red-600 hover:text-red-700 cursor-pointer"
              onClick={() => console.log('deletou')}
            >
              <BsTrash3Fill />
            </div>
          </div>
          <h2 className="text-sky-700 font-medium truncate hover:whitespace-normal">
            {item.nome_exame}
          </h2>
        </div>
      </div>
    );
  };

export default ExameList;

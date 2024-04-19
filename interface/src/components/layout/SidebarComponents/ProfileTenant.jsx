import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

function ProfileTenant({ tenant }) {
  return (
    <>
      {/* Tenant Infos */}
      <div className='w-full bg-sky-600 shadow-md px-4 py-4 rounded-xl'>
        <div className='px-4 grid grid-cols-3'>
          <div className='col-span-2'>
            <h2 className='text-white font-extrabold text-xl truncate'>{tenant[0].nome_tenant}</h2>
            <div className="flex items-center mb-2 gap-2">
              <p className='text-white text-sm font-light'>Endereço:</p>
              <p className='text-white truncate'>{tenant[0].rua_tenant}, {tenant[0].numero_tenant} - {tenant[0].bairro_tenant} - {tenant[0].cidade_tenant}/{tenant[0].uf_tenant}</p>
            </div>
            <div>
              <h1 className="text-white text-sm font-light">Contato:</h1>
              <div className='bg-white w-2/4 rounded-sm px-2 py-1 text-center grid grid-cols-2 justify-center items-center gap-2'>
                <p className='text-sky-600 font-semibold truncate text-right'>Contato</p>
                <p className='text-sm text-gray-700 font-light truncate text-left'>- Email</p>
              </div>
            </div>
          </div>
          <div className='col-span-1 text-right px-2'>
            <h2 className='text-white font-extrabold text-xl truncate'>{tenant[0].cnpj_tenant}</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileTenant;
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

function ProfileTenant({ tenant }) {
  return (
    <>
      {/* Tenant Infos */}
      <div className='w-full bg-sky-600 shadow-md px-4 py-4 rounded-xl'>
        <div className='px-4 grid grid-cols-3'>
          <div className='col-span-2'>
            <h2 className='text-white font-extrabold text-xl truncate'>{tenant[0].nome_tenant}</h2>
            <div className="flex items-center gap-2">
              <p className='text-white text-sm font-light'>Endereço:</p>
              <p className='text-white truncate'>{tenant[0].rua_tenant}, {tenant[0].numero_tenant} - {tenant[0].bairro_tenant} - {tenant[0].cidade_tenant}/{tenant[0].uf_tenant}</p>
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
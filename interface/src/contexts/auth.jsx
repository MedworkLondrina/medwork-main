import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { connect } from "../services/api";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

  const [selectedCompany, setSelectedCompany] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [exames, setExames] = useState([]);
  const [riscos, setRiscos] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [medidasAdm, setMedidasAdm] = useState([]);
  const [medidasEpi, setMedidasEpi] = useState([]);
  const [medidasEpc, setMedidasEpc] = useState([]);
  const [setoresProcessos, setSetoresProcessos] = useState([]);
  const [setoresExames, setSetoresExames] = useState([]);
  const [processosRiscos, setProcessosRiscos] = useState([]);
  const [riscosMedidas, setRiscosMedidas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [plano, setPlano] = useState([]);
  const [globalSprm, setGlobalSprm] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [aparelhos, setAparelhos] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [user, setUser] = useState([]);
  const [laudoVersion, setLaudoVersion] = useState([]);
  const [conclusoes, setConclusoes] = useState([]);
  const [loginUser, setLoginUser] = useState(false);

  useEffect(() => {
    if (loginUser) {
      setLoginUser(false);
    }
  }, [loginUser]);


  const handleSetCompanyId = () => {
    try {
      setCompanyId(selectedCompany[0]?.id_empresa);
    } catch (error) {
      console.log("Erro ao setar id da empresa.", error)
    }
  };

  const getTable = async () => {
    try {
      const code = user.tenant_code;
      const queryParams = new URLSearchParams({ tenent_code: code }).toString();
      const res = await fetch(`${connect}/elaboradores?${queryParams}`);

      if (!res.ok) {
        throw new Error(`Erro ao buscar tabela. Status: ${res.status}`)
      }

      return res.json();
    } catch (error) {
      console.error(`Erro ao buscar tabela. Status: ${error}`);
    }
  }

  const getEmpresas = async () => {
    try {
      const response = await fetch(`${connect}/empresas`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar empresas. Status: ${response.status}`)
      }

      const data = await response.json();
      data.sort((a, b) => {
        if (a.ativo < b.ativo) return 1;
        if (a.ativo > b.ativo) return -1;

        return a.nome_empresa.localeCompare(b.nome_empresa);
      });

      setEmpresas(data)
    } catch (error) {
      toast.warn("Erro ao buscar empresas");
      console.log(`Erro ao buscar empresas. ${error}`)
    }
  };

  const fetchEmpresas = async () => {
    try {
      const code = await checkTenantCode();
      if (!code) return;


      const queryParams = new URLSearchParams({ tenent_code: code }).toString();
      const response = await fetch(`${connect}/empresas?${queryParams}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar os dados da empresa! Status: ${response.status}`)
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar os dados da empresa! Status: ${error}`)
    }
  };

  const getContatos = async () => {
    try {
      const response = await fetch(`${connect}/contatos`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar contatos. Status: ${response.status}`)
      }

      const data = await response.json();
      data.sort((a, b) => {
        if (a.ativo < b.ativo) return 1;
        if (a.ativo > b.ativo) return -1;

        return b.id_contato - a.id_contato;
      });

      setContatos(data)
    } catch (error) {
      toast.warn("Erro ao buscar contatos");
      console.log(`Erro ao buscar contatos. ${error}`)
    }
  };

  const fetchContatos = async (idEmpresa) => {
    try {
      let idCompany;
      if (idEmpresa) {
        idCompany = idEmpresa
      } else {
        idCompany = await checkCompanyId();
      }
      if (!idCompany) return;

      const queryParams = new URLSearchParams({ companyId: idCompany }).toString();

      const response = await fetch(`${connect}/contatos?${queryParams}`);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar contatos. ${error}`)
    }
  };

  const handleSelectedCompany = async (id, nameCompany) => {
    try {
      if (!id) {
        toast.warn("Erro ao selecionar empresa!");
        throw new Error("Erro ao selecionar empresa!");
      }

      try {
        const response = await fetch(`${connect}/selectCompany/${id}`);

        if (!response.ok) {
          throw new Error(`Erro ao selecionar empresa! Status: ${response.status}`);
        }

        const newSelectedCompany = {
          id_empresa: id,
          nome_empresa: nameCompany,
        };

        setCompanyId(newSelectedCompany.id_empresa);

        localStorage.removeItem('selectedCompanyData');
        localStorage.setItem('selectedCompanyData', JSON.stringify(newSelectedCompany));

        setSelectedCompany(newSelectedCompany);
        toast.success(`Empresa ${nameCompany} selecionada!`);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.log("Erro ao selecionar empresa", error)
    }
  };

  const getUnidades = async () => {
    try {
      const response = await fetch(`${connect}/unidades`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar unidades. Status: ${response.status}`);
      }

      const data = await response.json();
      const filteredUnidades = data.filter((unidade) => unidade.fk_empresa_id === companyId);

      filteredUnidades.sort((a, b) => {
        if (a.ativo < b.ativo) return 1;
        if (a.ativo > b.ativo) return -1;

        return a.nome_unidade.localeCompare(b.nome_unidade);
      });
      setUnidades(filteredUnidades);
    } catch (error) {
      console.log(`Erro ao buscar unidades. ${error}`);
    }
  };

  const fetchUnidades = async () => {
    try {
      const idCompany = await checkCompanyId();
      if (!idCompany) throw new Error('Company not found');

      const queryParams = new URLSearchParams({ companyId: idCompany }).toString();

      const response = await fetch(`${connect}/unidades?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar unidades. Status: ${response.status}`);
      }

      const data = await response.json();

      data.sort((a, b) => {
        if (a.ativo < b.ativo) return 1;
        if (a.ativo > b.ativo) return -1;

        return a.nome_unidade.localeCompare(b.nome_unidade);
      });
      return data;
    } catch (error) {
      console.log(`Erro ao buscar unidades. ${error}`);
    }
  };

  const getSetores = async () => {
    try {
      const response = await fetch(`${connect}/setores`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar setores. Status: ${response.status}`)
      }

      const data = await response.json();
      data.sort((a, b) => a.nome_setor.localeCompare(b.nome_setor));
      setSetores(data)
    } catch (error) {
      console.log(`Erro ao buscar setores. ${error}`);
    }
  };

  const fetchSetores = async () => {
    try {
      const idCompany = await checkCompanyId();
      if (!idCompany) throw new Error('Company not found');

      const queryParams = new URLSearchParams({ companyId: idCompany }).toString();

      const response = await fetch(`${connect}/setores?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar Setores. Status: ${response.status}`);
      }

      const data = await response.json();

      data.sort((a, b) => {
        if (a.ativo < b.ativo) return 1;
        if (a.ativo > b.ativo) return -1;

        return a.nome_setor.localeCompare(b.nome_setor);
      });
      return data;
    } catch (error) {
      console.log(`Erro ao buscar setores. ${error}`);
    }
  };

  const getCargos = async () => {
    try {
      const response = await fetch(`${connect}/cargos`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar cargos. Status: ${response.status}`)
      }

      const data = await response.json();
      data.sort((a, b) => a.nome_cargo.localeCompare(b.nome_cargo));
      setCargos(data)
    } catch (error) {
      console.log(`Erro ao buscar cargos. ${error}`);
    }
  };

  const fetchCargos = async () => {
    try {
      const idCompany = await checkCompanyId();
      if (!idCompany) throw new Error('Company not found');

      const queryParams = new URLSearchParams({ companyId: idCompany }).toString();

      const response = await fetch(`${connect}/cargos?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar Cargos. Status: ${response.status}`);
      }

      const data = await response.json();

      data.sort((a, b) => {
        if (a.ativo < b.ativo) return 1;
        if (a.ativo > b.ativo) return -1;

        return a.nome_cargo.localeCompare(b.nome_cargo);
      });
      return data;
    } catch (error) {
      console.log(`Erro ao buscar Cargos. ${error}`);
    }
  };

  const getProcessos = async () => {
    try {
      const tenant = await checkTenant();
      if (!tenant) throw new Error('Tenant not found');
      const code = await checkTenantCode();
      if (!code) throw new Error('Tenant Code not found');

      const queryParams = new URLSearchParams({ tenant_code: code, global: tenant.global }).toString();

      const response = await fetch(`${connect}/processos?${queryParams}`);


      if (!response.ok) {
        throw new Error(`Erro ao buscar processos. Status: ${response.status}`)
      }

      const data = await response.json();
      data.sort((a, b) => a.nome_processo.localeCompare(b.nome_processo));
      setProcessos(data)
      return data;
    } catch (error) {
      toast.warn("Erro ao buscar processos");
      console.log(`Erro ao buscar processos. ${error}`)
    }
  };

  const getRiscos = async () => {
    try {
      const tenant = await checkTenant();
      if (!tenant) throw new Error('Tenant not found');
      const code = await checkTenantCode();
      if (!code) throw new Error('Tenant Code not found');

      const queryParams = new URLSearchParams({ tenant_code: code, global: tenant.global }).toString();

      const response = await fetch(`${connect}/riscos?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar riscos. Status: ${response.status}`)
      }

      const data = await response.json();
      data.sort((a, b) => {
        return a.nome_risco.localeCompare(b.nome_risco);
      });
      setRiscos(data);
      return data;
    } catch (error) {
      toast.warn("Erro ao buscar riscos");
      console.log(`Erro ao buscar riscos. ${error}`)
    }
  };

  const fetchMedidas = async (params) => {
    try {
      const tenant = await checkTenant();
      if (!tenant) throw new Error('Tenant not found');
      const code = await checkTenantCode();
      if (!code) throw new Error('Tenant Code not found');

      const queryParams = new URLSearchParams({ grupo: params, tenant_code: code, global: tenant.global });

      const response = await fetch(`${connect}/medidas?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar medidas. Status: ${response.status}`)
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar medidas. ${error}`)
    }
  }

  const getMedidasAdm = async () => {
    try {
      const response = await fetch(`${connect}/medidas_adm`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar medidas adminitrativas. Status: ${response.status}`)
      }

      const data = await response.json();
      data.sort((a, b) => {
        return a.descricao_medida_adm.localeCompare(b.descricao_medida_adm);
      });

      setMedidasAdm(data)
    } catch (error) {
      toast.warn("Erro ao buscar medidas adminitrativas");
      console.log(`Erro ao buscar medidas adminitrativas. ${error}`)
    }
  };

  const getMedidasEpi = async () => {
    try {
      const response = await fetch(`${connect}/medidas_epi`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar epi's. Status: ${response.status}`)
      }

      const data = await response.json();
      data.sort((a, b) => {
        return a.nome_medida.localeCompare(b.nome_medida);
      });

      setMedidasEpi(data)
    } catch (error) {
      toast.warn("Erro ao buscar epi's");
      console.log(`Erro ao buscar epi's. ${error}`)
    }
  };

  const getMedidasEpc = async () => {
    try {
      const response = await fetch(`${connect}/medidas_epc`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar epc's. Status: ${response.status}`)
      }

      const data = await response.json();
      data.sort((a, b) => {
        return a.descricao_medida.localeCompare(b.descricao_medida);
      });

      setMedidasEpc(data)
    } catch (error) {
      toast.warn("Erro ao buscar epc's");
      console.log(`Erro ao buscar epc's. ${error}`)
    }
  };

  const getSetoresProcessos = async () => {
    try {
      const response = await fetch(`${connect}/setores_processos`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar Processos dos setores. Status: ${response.status}`)
      }

      const data = await response.json();
      setSetoresProcessos(data);
      return data;
    } catch (error) {
      toast.warn("Erro ao buscar Setores Processos");
      console.log(`Erro ao buscar Setores Processos. ${error}`)
    }
  };

  const getProcessosRiscos = async () => {
    try {
      const response = await fetch(`${connect}/processos_riscos`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar Riscos dos processos. Status: ${response.status}`)
      }

      const data = await response.json();
      setProcessosRiscos(data);
      return data;
    } catch (error) {
      toast.warn("Erro ao buscar Processos Riscos");
      console.log(`Erro ao buscar Processos Riscos. ${error}`)
    }
  };

  const getRiscosMedidas = async () => {
    try {
      const response = await fetch(`${connect}/riscos_medidas`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar Medidas dos riscos. Status: ${response.status}`)
      }

      const data = await response.json();
      setRiscosMedidas(data);
      return data;
    } catch (error) {
      toast.warn("Erro ao buscar Medidas dos riscos");
      console.log(`Erro ao buscar Medidas dos riscos. ${error}`)
    }
  };

  

  const getRiscosExames = async () => {
    try {
      const response = await fetch(`${connect}/risco_exame`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar vinculos entre riscos e exames. Status: ${response.status}`)
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar vinculos entre riscos e exames! ${error}`)
    }
  }

  const fetchProcessoCnae = async () => {
    try {
      const response = await fetch(`${connect}/processo_cnae`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar vinculos entre processo e CNAE. Status: ${response.status}`)
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar vinculos entre processo e CNAE. ${error}`);
    }
  };

  const fetchCnae = async () => {
    try {
      const response = await fetch(`${connect}/cnae`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar CNAE. Status: ${response.status}`)
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar CNAE. ${error}`);
    }
  };

  const getPlano = async () => {
    try {
      const response = await fetch(`${connect}/plano`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar Plano de Ação. Status: ${response.status}`)
      }

      const data = await response.json();
      setPlano(data);
      return data;
    } catch (error) {
      toast.warn("Erro ao buscar Plano de Ação");
      console.log(`Erro ao buscar Plano de Ação. ${error}`)
    }
  };

  const getInventario = async () => {
    try {
      const idCompany = await checkCompanyId();
      const queryParams = new URLSearchParams({ companyId: idCompany }).toString();
      const response = await fetch(`${connect}/inventario?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar Inventário. Status: ${response.status}`)
      }

      const data = await response.json();
      setInventario(data)
      return data;
    } catch (error) {
      toast.warn("Erro ao buscar Inventário");
      console.log(`Erro ao buscar Inventário. ${error}`)
    }
  };

  const getGlobalSprm = async () => {
    try {
      const response = await fetch(`${connect}/global_sprm`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar medidas do setor. Status: ${response.status}`)
      }

      const data = await response.json();
      setGlobalSprm(data);
      return data;
    } catch (error) {
      toast.warn("Erro ao buscar medidas do setor");
      console.log(`Erro ao buscar medidas do setor. ${error}`)
    }
  };

  const getUsuarios = async () => {
    try {
      const code = await checkTenantCode();
      if (!code) return;

      const queryParams = new URLSearchParams({ tenant_code: code }).toString();
      const response = await fetch(`${connect}/usuarios?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar Usuários. Status: ${response.status}`)
      }

      const data = await response.json();
      setUsuarios(data);
      return data;
    } catch (error) {
      console.log(`Erro ao buscar Usuários. ${error}`);
    }
  };

  const getAparelhos = async () => {
    try {
      const code = user.tenant_code;
      const queryParams = new URLSearchParams({ tenent_code: code }).toString();
      const response = await fetch(`${connect}/aparelhos?${queryParams}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar os dados da empresa! Status: ${response.status}`)
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar os dados da empresa! Status: ${error}`)
    }
  };

  const getLaudoVersion = async () => {
    try {
      const response = await fetch(`${connect}/laudo_version`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar laudos. Status: ${response.status}`)
      }

      const data = await response.json();
      data.sort((a, b) => a.data_versao < b.data_versao);
      setLaudoVersion(data)
    } catch (error) {
      console.log(`Erro ao buscar Versões do laudo. ${error}`);
    }
  };

  const getConclusoes = async (idrisco) => {
    try {
      const query = new URLSearchParams({ id_risco: idrisco }).toString();
      const response = await fetch(`${connect}/conclusoes?${query}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar conclusões. Status: ${response.status}`)
      }

      const data = await response.json();
      return data
    } catch (error) {
      console.log(`Erro ao buscar conclusões. ${error}`);
    }
  };

  const getExames = async () => {
    try {
      const res = await fetch(`${connect}/exames`);
      const data = await res.json();
      return data
    } catch (error) {
      console.error(`Erro ao buscar exames! Status: ${error}`)
    }
  }

  const getSetoresExames = async (setorId) => {
    try {
      const res = await fetch(`${connect}/setor_exame/${setorId}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar exames! Status: ${error}`);
      throw error;
    }
  }
  const getExamesSemVinculo = async (setorId) => {
    try {
      const res = await fetch(`${connect}/exames_sem_vinculo/${setorId}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar exames! Status: ${error}`);
      throw error;
    }
  }
  
  const getRiscosExamesSemVinculo = async (riscoId) => {
    try {
      const res = await fetch(`${connect}/risco_exames_nao_vinculados/${riscoId}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar exames! Status: ${error}`);
      throw error;
    }
  }
  const getRiscosExamesComVinculo = async (riscoId) => {
    try {
      const res = await fetch(`${connect}/exames_por_risco/${riscoId}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar exames! Status: ${error}`);
      throw error;
    }
  }
  


  const getTenant = async (tenant) => {
    try {
      const code = tenant;
      const queryParams = new URLSearchParams({ tenent_code: code }).toString();

      const response = await fetch(`${connect}/tenant?${queryParams}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar Inquilino! Status: ${response.status}`)
      }

      const data = await response.json();

      const newTenant = {
        tenant: data[0].nome_tenant,
        global: data[0].global,
      }

      localStorage.removeItem('tenant');
      localStorage.setItem('tenant', JSON.stringify(newTenant));
      return data;
    } catch (error) {
      console.error("Erro ao buscar Inquilino!", error)
    }
  };

  const loadSelectedCompanyFromLocalStorage = () => {
    try {
      const selectedCompanyDataLocal = localStorage.getItem('selectedCompanyData');

      if (selectedCompanyDataLocal) {
        const parseData = JSON.parse(selectedCompanyDataLocal);
        setCompanyId(parseData.id_empresa);
        setSelectedCompany(parseData);
        return parseData;
      }
    } catch (error) {
      console.log("Erro ao carregar empresa do localStorage", error)
    }
  };

  const handleSignInUser = async (authToken, user) => {
    try {
      const userDefine = {
        id_usuario: user.id_usuario,
        tenant_code: user.fk_tenant_code,
        nome_usuario: user.nome_usuario,
        permissao_usuario: user.tipo,
        token_usuario: authToken,
      }

      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify(userDefine));
      setUser(userDefine);
    } catch (error) {
      console.log("Erro ao logar e autenticar usuario!", error)
    }
  };

  const clearUser = async () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      localStorage.removeItem('selectedCompanyData');
      setSelectedCompany([]);
      setCompanyId('');
    } catch (error) {
      console.log("Erro ao limpar os dados de usuario e empresa!", error)
    }
  };

  const checkSignIn = async () => {
    try {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        const userLogged = JSON.parse(storedUser);
        setUser(userLogged);
        return userLogged;
      }
    } catch (error) {
      console.log("Erro ao checar usuario!", error)
    }
  };

  const checkTenantCode = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return null;
      const userData = JSON.parse(user);
      const code = userData.tenant_code;
      return code;
    } catch (error) {
      console.log("Erro ao checar o tenant code!", error)
    }
  };

  const checkTenant = async () => {
    try {
      const res = localStorage.getItem('tenant');
      if (!res) return null;
      const tenant = JSON.parse(res);
      return tenant;
    } catch (error) {
      console.error(`Erro ao buscar tenant. ${error}`)
    }
  }

  const checkCompanyId = async () => {
    try {
      const company = localStorage.getItem('selectedCompanyData');
      if (!company) return null;
      const companyData = JSON.parse(company);
      const companyId = companyData.id_empresa;
      return companyId;
    } catch (error) {
      console.log("Erro ao checar o tenant code!", error)
    }
  }

  const handleClearLocalStorageCompany = () => {
    localStorage.removeItem('selectedCompanyData');
  };

  return (
    <AuthContext.Provider
      value={{
        handleSelectedCompany,
        handleClearLocalStorageCompany,
        selectedCompany,
        handleSetCompanyId,
        loadSelectedCompanyFromLocalStorage,
        companyId,
        getEmpresas,
        setEmpresas,
        empresas,
        getUnidades,
        setUnidades,
        unidades,
        getContatos,
        setContatos,
        contatos,
        getSetores,
        setSetores,
        setores,
        getCargos,
        setCargos,
        cargos,
        getProcessos,
        setProcessos,
        processos,
        getRiscos,
        setRiscos,
        riscos,
        getMedidasAdm,
        setMedidasAdm,
        medidasAdm,
        getMedidasEpi,
        setMedidasEpi,
        medidasEpi,
        getMedidasEpc,
        setMedidasEpc,
        medidasEpc,
        getSetoresProcessos,
        setSetoresProcessos,
        setoresProcessos,
        getProcessosRiscos,
        setProcessosRiscos,
        processosRiscos,
        getRiscosMedidas, setRiscosMedidas,
        riscosMedidas,
        getInventario,
        inventario,
        getPlano,
        setPlano,
        plano,
        getGlobalSprm,
        setGlobalSprm,
        globalSprm,
        getUsuarios,
        setUsuarios,
        usuarios,
        user,
        setUser,
        getAparelhos,
        setAparelhos,
        aparelhos,
        handleSignInUser,
        checkSignIn,
        clearUser,
        getLaudoVersion,
        setLaudoVersion,
        laudoVersion,
        getConclusoes,
        setConclusoes,
        conclusoes,
        getTable,
        fetchEmpresas,
        fetchContatos,
        fetchUnidades,
        fetchSetores,
        fetchCargos,
        getTenant,
        fetchMedidas,
        loginUser,
        setLoginUser,
        fetchCnae,
        fetchProcessoCnae,
        checkTenant,
        getExames,
        getSetoresExames,
        getRiscosExames,
        getExamesSemVinculo,
        getRiscosExamesSemVinculo,
        getRiscosExamesComVinculo,
        
      }}>
      {children}
    </AuthContext.Provider>
  );
};

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import OpenSansLight from '../../../../media/fonts/OpenSans-Light.ttf';
import OpenSansRegular from '../../../../media/fonts/OpenSans-Regular.ttf';
import OpenSansMedium from '../../../../media/fonts/OpenSans-Medium.ttf';
import OpenSansSemiBold from '../../../../media/fonts/OpenSans-SemiBold.ttf';
import OpenSansBold from '../../../../media/fonts/OpenSans-Bold.ttf';
import OpenSansExtraBold from '../../../../media/fonts/OpenSans-ExtraBold.ttf';
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaAddressCard } from "react-icons/fa";


function PcsmoGenerate({
  inventario, plano, sprm, elaborador, dados, data,pdfVersion,}) {

  const findSetor = (item) => {
    const findSetor = dados.setores.find((i) => i.id_setor === item);
    return findSetor ? findSetor.nome_setor : "N/A";
  };

  const getTotalFuncMasc = () => {
    return dados.cargos.reduce((total, cargo) => total + cargo.func_masc, 0);
  };

  const getTotalFuncFem = () => {
    return dados.cargos.reduce((total, cargo) => total + cargo.func_fem, 0);
  };

  const getTotalFuncMenor = () => {
    return dados.cargos.reduce((total, cargo) => total + cargo.func_menor, 0);
  };

  const getTotalFunc = () => {
    const funcMasc = dados.cargos.reduce((total, cargo) => total + cargo.func_masc, 0);
    const funcFem = dados.cargos.reduce((total, cargo) => total + cargo.func_fem, 0);
    const funcMenor = dados.cargos.reduce((total, cargo) => total + cargo.func_menor, 0);

    return funcMasc + funcFem + funcMenor;
  };

  const find = (item, tipo) => {
    try {
      if (!item) {
        return 'N/A';
      }

      switch (tipo) {
        case 'nome_unidade':
          const unidadeEncontrada = dados.unidades.find((c) => c.id_unidade === item);
          return unidadeEncontrada ? unidadeEncontrada.nome_unidade : 'N/A';

        case 'nome_setor':
          const setorEncontrado = dados.setores.find((c) => c.id_setor === item);
          return setorEncontrado ? setorEncontrado.nome_setor : 'N/A';

        case 'nome_processo':
          const processoEncontrado = dados.processos.find((c) => c.id_processo === item);
          return processoEncontrado ? processoEncontrado.nome_processo : 'N/A';

        case 'nome_aparelho':
          const aparelhosEncontrado = dados.aparelhos.find((c) => c.id_aparelho === item);
          const aparelho = `${aparelhosEncontrado.nome_aparelho || "N/A"} - ${aparelhosEncontrado.marca_aparelho || "N/A"} (${formatData(aparelhosEncontrado.data_calibracao_aparelho) || "N/A"})`;
          return aparelho;

        case 'nome_medida':
          const medidaEncontrada = dados.medidas.find((c) => c.id_medida === item);
          const medida = `${medidaEncontrada.grupo_medida || "N/A"} - ${medidaEncontrada.descricao_medida || "N/A"}`;
          return medida;

        case 'nome_risco':
        case 'grupo_risco':
        case 'consequencia':
        case 'avaliacao':
        case 'limite_tolerancia':
        case 'metodologia':
        case 'severidade':
        case 'unidade_medida':
          const riscoEncontrado = dados.riscos.find((c) => c.id_risco === item);
          if (riscoEncontrado) {
            switch (tipo) {
              case 'nome_risco':
                return riscoEncontrado.nome_risco || "N/A";
              case 'grupo_risco':
                return riscoEncontrado.grupo_risco || "N/A";
              case 'consequencia':
                return riscoEncontrado.danos_saude_risco || "N/A";
              case 'avaliacao':
                return riscoEncontrado.classificacao_risco || "N/A";
              case 'limite_tolerancia':
                return riscoEncontrado.limite_tolerancia_risco || "0";
              case 'metodologia':
                return riscoEncontrado.metodologia_risco || "N/A";
              case 'severidade':
                return riscoEncontrado.severidade_risco || "N/A";
              case 'unidade_medida':
                return riscoEncontrado.unidade_medida_risco;
            }
          } else {
            return 'N/A';
          }
        default:
          return 'N/A';
      }
    } catch (error) {
      console.log("Erro ao buscar Dados!", error);
      return 'N/A';
    }
  };

  const formatData = (item) => {
    try {
      const data_formatada = new Date(item).toLocaleDateString('pr-BR');
      return data_formatada || 'N/A';
    } catch (error) {
      console.log("Erro ao formatar data!", error);
    }
  };

  const convertMedidas = (medidas, setorId, processoId, riscoId) => {
    try {
      const medidasArray = JSON.parse(medidas);
      return medidasArray.map(({ descricao_medida, grupo_medida, id_medida }) => {
        const sprmItem = sprm.find(s =>
          s.fk_setor_id === setorId &&
          s.fk_processo_id === processoId &&
          s.fk_risco_id === riscoId &&
          s.fk_medida_id === id_medida
        );

        const certificadoEpi = sprmItem ? sprmItem.certificado_epi : 'N/A';
        return `${grupo_medida}: ${descricao_medida} - \n ${certificadoEpi != null ? `C.A: ${certificadoEpi}` : ''}`;
      }).join('\n');
    } catch (error) {
      console.error("Erro ao converter medidas:", error);
      return 'N/A';
    }
  };

  
  const findMedidas = (medida) => {
    try {
      const find = dados.medidas.find((c) => c.id_medida === medida);
      return `${find.grupo_medida || "N/A"} - ${find.descricao_medida || "N/A"}`
    } catch (error) {
      console.error("Erro ao buscar medida!", error)
    }
  };

  

  const getColorStatus = (item) => {
    try {
      switch (item) {
        case 'Não Realizado':
          return '#ffc971'
        default:
          return '#e9ecef'
      }
    } catch (error) {
      console.log("Erro ao modificar cor de fundo!", error)
    }
  };

 
  const setVigencia = (item) => {
    try {
      const dataCalculada = new Date(item);

      dataCalculada.setFullYear(dataCalculada.getFullYear() + 2);
      return formatData(dataCalculada);
    } catch (error) {
      console.log("Erro ao calcular data", error)
    }
  };

  const findRegisterName = (item) => {
    try {
      switch (item) {
        case 'Engenheiro':
          return 'CREA'
        case 'Médico':
          return 'CRM'
        case 'Técnico':
          return 'Registro'
        default:
          break;
      }
    } catch (error) {
      console.error(`Erro ao filtrar registro ${error}`)
    }
  };

  const getFirstLetter = (item) => {
    return item.charAt(0);
  };

 
  Font.register({ family: 'OpenSansLight', src: OpenSansLight });
  Font.register({ family: 'OpenSansRegular', src: OpenSansRegular });
  Font.register({ family: 'OpenSansMedium', src: OpenSansMedium });
  Font.register({ family: 'OpenSansSemiBold', src: OpenSansSemiBold });
  Font.register({ family: 'OpenSansBold', src: OpenSansBold });
  Font.register({ family: 'OpenSansExtraBold', src: OpenSansExtraBold });


  const PageStyles = StyleSheet.create({
    pageCenter: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 40,
      paddingVertical: 10,
      height: '100%',
    },

    Page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 40,
      paddingVertical: 10,
      height: '100%',
    },

    LandscapePage: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 10,
      paddingVertical: 10,
      height: '100%',
    },

    coverPage: {
      backgroundColor: '#ad2831',
      padding: 10,
      color: '#fff',
    },
  });

  const TextStyles = StyleSheet.create({
    headerText: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 5,
      paddingTop: 10,
      fontFamily: 'OpenSansBold',
    },

    topText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },

    centerText: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20,
      fontFamily: 'OpenSansExtraBold',
    },

    SignatureDate: {
      fontSize: 10,
      textAlign: 'left',
      color: '#343a40',
      fontFamily: 'OpenSansLight',
    },

    officeText: {
      fontSize: 12,
      fontFamily: 'OpenSansRegular',
    },

    officeSmallText: {
      fontSize: 10,
      color: '#6c757d',
      fontFamily: 'OpenSansLight',
    },

    smallText: {
      fontSize: 12,
    },

    littleText: {
      fontSize: 10,
      textAlign: 'center',
      fontFamily: 'OpenSansRegular',
    },

    smallTextVigencia: {
      fontSize: 10,
    },

    subTitleSumary: {
      fontSize: 16,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      fontFamily: 'OpenSansBold',
    },

    subSubTitleSumary: {
      fontSize: 12,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginLeft: 10,
      marginTop: 10,
    },

    prefixText: {
      fontSize: 8,
      color: '#6c757d',
      marginRight: 5,
      fontFamily: 'OpenSansLight',
    },

    prefixTextTitle: {
      fontSize: 8,
      color: '#ced4da',
      marginRight: 5,
      fontFamily: 'OpenSansLight',
    },

    valueText: {
      fontSize: 12,
      color: '#495057',
      fontFamily: 'OpenSansRegular',
    },

    valueTextTitle: {
      fontSize: 14,
      color: '#f8f9fa',
      fontFamily: 'OpenSansMedium',
    },

    valueTextSignatureTitle: {
      fontSize: 12,
      color: '#f8f9fa',
      fontFamily: 'OpenSansBold',
      textAlign: 'center',
    },

    footerText: {
      fontSize: 10,
      textAlign: 'center',
      marginTop: 5,
      fontFamily: 'OpenSansBold',
    },

    footerAddresText: {
      fontSize: 10,
      textAlign: 'center',
      marginTop: 2,
      color: '#6c757d',
      fontFamily: 'OpenSansLight',
    },

    title: {
      fontSize: 11,
      marginTop: 10,
    },

    paragraph: {
      fontSize: 10,
      textAlign: 'justify',
      textTransform: 'none',
      marginBottom: 10,
      fontFamily: 'OpenSansRegular',
    },

    tableContentText: {
      flexWrap: 'wrap',
      fontFamily: 'OpenSansRegular',
      fontSize: 8,
    },

    tableContentSubText: {
      fontFamily: 'OpenSansLight',
      fontSize: 6,
      color: '#6c757d',
    },

    legend: {
      fontFamily: 'OpenSansLight',
      fontSize: 7,
    },

    legendBold: {
      fontFamily: 'OpenSansMedium',
      fontSize: 7,
    },
  });

  const ContainerStyles = StyleSheet.create({
    headerContainer: {
      width: '100%',
      borderBottom: '1 solid #e5e5e5',
      marginBottom: 20,
    },

    centerContainer: {
      marginTop: 'auto',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },

    bottomContainer: {
      marginTop: 'auto',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },

    bottomContainerVigencia: {
      marginTop: 'auto',
      width: '100%',
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },

    signatureContainer: {
      width: '100%',
      marginTop: 50,
    },

    footerContainer: {
      marginTop: 'auto',
      width: '100%',
      borderTop: '1 solid #e5e5e5',
    },

    textContainer: {
      marginTop: 10,
      marginLeft: 10,
    },
  });

  const TableStyles = StyleSheet.create({
    table: {
      marginTop: 10,
      width: '100%',
    },

    headerCell: {
      padding: 5,
      backgroundColor: '#0077b6',
      width: '100%',
    },

    headerTable: {
      padding: 2,
      backgroundColor: '#0077b6',
      width: '100%',
      flexDirection: 'row',
    },

    headerCellTable: {
      width: '33%',
      justifyContent: 'center',
      alignItems: 'center',
    },

    tableRow: {
      borderBottom: '1 solid #343a40',
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
    },

    seventyFiveRow: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      width: '75%',
    },

    fiftyRow: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      width: '50%',
    },

    fortyRow: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      width: '40%',
    },

    twentyFiveRow: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      width: '25%',
    },

    twentyRow: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      width: '20%',
    },

    fifTeenRow: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      width: '15%',
    },

    contentTable: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2,
    },

    contentCell: {
      width: '100%',
    },

    contentColumm: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },

    contentRiskTable: {
      flexDirection: 'row',
    },

    contentRiskCell: {
      border: '0.3 solid #333333',
      height: '100%',
      justifyContent: 'center',
      paddingHorizontal: 5,
      paddingVertical: 2,
    },

  });

  const HeaderPage = () => {
    return (
      <View style={ContainerStyles.headerContainer}>
        <Text style={TextStyles.headerText}>PCMSO - Programa de Controle Médico de Saúde Ocupacional</Text>
        <Text style={TextStyles.littleText}>{dados.empresas[0].nome_empresa || ''} - Versão: </Text>
      </View>
    );
  }

  const FooterPage = () => {
    return (
      <View style={ContainerStyles.footerContainer}>
        <Text style={TextStyles.footerText}>{dados.empresas[0].nome_empresa || '-'}</Text>
        <Text style={TextStyles.footerAddresText}> - </Text>
      </View>
    );
  }

  const CoverPage = () => {
    return (
      <Page size="A4" style={PageStyles.Page}>
        <Text style={TextStyles.headerText}>PCMSO - Programa de Controle Médico de Saúde Ocupacional</Text>
        <View style={ContainerStyles.centerContainer}>
          <Text style={TextStyles.centerText}>{dados.empresas[0].nome_empresa}</Text>
        </View>
        <View style={ContainerStyles.bottomContainerVigencia}>
          <Text style={TextStyles.smallTextVigencia}>Londrina, {formatData(data)} - Vigência: {setVigencia(data)}</Text>
        </View>
      </Page>
    )
  };

  

  const MyDocument = () => {
    return (
      <Document>
        <CoverPage />
      
      </Document>
    );
  };

  return MyDocument();
}

export default PcsmoGenerate;

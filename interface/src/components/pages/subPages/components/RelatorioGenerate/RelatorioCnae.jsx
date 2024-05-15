import React, { useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import OpenSansLight from '../../../../media/fonts/OpenSans-Light.ttf';
import OpenSansRegular from '../../../../media/fonts/OpenSans-Regular.ttf';
import OpenSansMedium from '../../../../media/fonts/OpenSans-Medium.ttf';
import OpenSansSemiBold from '../../../../media/fonts/OpenSans-SemiBold.ttf';
import OpenSansBold from '../../../../media/fonts/OpenSans-Bold.ttf';
import OpenSansExtraBold from '../../../../media/fonts/OpenSans-ExtraBold.ttf';

function RelatorioCnae({ company, companyCnae, companyProcess, selectedCnaes, filterProcess }) {

  console.log(companyProcess)

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
      fontSize: 10,
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
      fontSize: 12,
      fontFamily: 'OpenSansBold',
    },

    paragraph: {
      fontSize: 10,
      textAlign: 'justify',
      textTransform: 'none',
      marginBottom: 10,
      fontFamily: 'OpenSansRegular',
    },

    tableTitle: {
      fontFamily: 'OpenSansBold',
      fontSize: 10,
      color: '#ffffff',
      textAlign: 'center',
    },

    tableTitleSize8: {
      fontFamily: 'OpenSansBold',
      fontSize: 8,
      color: '#ffffff',
      textAlign: 'center',
    },

    contentTableText: {
      fontFamily: 'OpenSansRegular',
      fontSize: 8,
    },

    listItem: {
      marginBottom: 5,
      fontSize: 10,
      fontFamily: 'OpenSansLight',
    },

    listItemRoman: {
      marginBottom: 5,
      fontSize: 10,
      fontFamily: 'OpenSansBold',
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

    space10: {
      paddingTop: 10,
      paddingBottom: 10,
    },

    space: {
      paddingTop: 5,
      paddingBottom: 5,
    },

    spaceTop20: {
      paddingTop: 20,
    },

    list: {
      marginLeft: 10,
      marginBottom: 10,
    },

    listRoman: {
      marginRigth: 10,
    },
  });

  const TableStyles = StyleSheet.create({
    table: {
      marginTop: 10,
      width: '100%',
      marginBottom: 10,
    },

    headerCell: {
      padding: 5,
      backgroundColor: '#0077b6',
      width: '100%',
    },

    headerTable: {
      padding: 2,
      backgroundColor: '#0077b6',
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

    headerSignatureContentCell: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: '#0077b6',
      width: '100%',
      flexDirection: 'row',
    },

    headerSignatureCell: {
      width: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },

    signatureLine: {
      height: '20%',
      borderBottom: '1 solida #343a40'
    },

    officeFiftyRow: {
      paddingHorizontal: 10,
      paddingVertical: 20,
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
    },

    contentTable: {
      flexDirection: 'row',
    },

    contentCell: {
      border: '0.3 solid #333333',
      height: '100%',
      justifyContent: 'center',
      paddingHorizontal: 5,
      paddingVertical: 2,
    },

    Column: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottom: '1 solida #495057',
    },

    headerColumn: {
      flex: 1,
      width: '30%',
      backgroundColor: '#0077b6',
      color: '#ffffff',
      padding: 8,
      fontSize: 11,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'OpenSansBold',
    },

    contentColumn: {
      width: '70%',
      flex: 2,
      padding: 5,
      fontSize: 8,
      textAlign: 'justify',
      justifyContent: 'center',
      fontFamily: 'OpenSansRegular',
    },

    list: {
      borderBottom: '1 solid #343a40',
    },

  });

  const HeaderPage = () => {
    return (
      <View style={ContainerStyles.headerContainer}>
        <Text style={TextStyles.headerText}>Laudo de Insalubridade</Text>
        <Text style={TextStyles.littleText}>Nome da Empresa - Versão</Text>
      </View>
    );
  }

  const FooterPage = () => {
    return (
      <View style={ContainerStyles.footerContainer}>
        <Text style={TextStyles.footerText}>Nome da Empresa</Text>
        <Text style={TextStyles.footerAddresText}>Rua Goias, 1914 - apto 301 - Londrina/PR 86020-410</Text>
      </View>
    );
  }

  const CoverPage = () => {
    return (
      <Page size="A4" orientation='landscape' style={PageStyles.Page}>
        <Text style={TextStyles.headerText}>Relatório por CNAE</Text>
        <Text style={TextStyles.subTitleSumary}>Cnaes Selecionados</Text>
        <View style={ContainerStyles.textContainer}>
          {selectedCnaes && selectedCnaes.map((cnae, index) => (
            <View key={index} style={TableStyles.list}>
              <Text style={TextStyles.listItem}>Cnae: {cnae.subclasse_cnae}</Text>
            </View>
          ))}
          <Text style={[TextStyles.paragraph, {marginTop: 10}]}>Processos</Text>
          {filterProcess && filterProcess.map((proc, index) => (
            <View key={index} style={TableStyles.list}>
              <Text style={TextStyles.listItem}>Processo: {proc.nome_processo}</Text>
            </View>
          ))}
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

export default RelatorioCnae;

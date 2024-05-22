import React, { useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import OpenSansLight from '../../../../media/fonts/OpenSans-Light.ttf';
import OpenSansRegular from '../../../../media/fonts/OpenSans-Regular.ttf';
import OpenSansMedium from '../../../../media/fonts/OpenSans-Medium.ttf';
import OpenSansSemiBold from '../../../../media/fonts/OpenSans-SemiBold.ttf';
import OpenSansBold from '../../../../media/fonts/OpenSans-Bold.ttf';
import OpenSansExtraBold from '../../../../media/fonts/OpenSans-ExtraBold.ttf';

function RelatorioCnae({ company, companyCnae, companyProcess, selectedCnaes, filterProcess, data }) {

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
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 10,
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
      fontSize: 12,
      textAlign: 'justify',
      fontFamily: 'OpenSansBold',
    },

    simpleText: {
      fontSize: 10,
      textAlign: 'justify',
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
      fontSize: 12,
      fontFamily: 'OpenSansRegular',
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

    cell: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 3,
    },

    cellTitle: {
      borderBottom: '1 solid #ccc',
      marginBottom: 5,
    },

    checkbox: {
      width: 10,
      height: 10,
      borderWidth: 1,
      borderColor: '#000',
      marginRight: 5,
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
      <>
        {data && data.map((item, index) => (
          <Page key={index} size="A4" style={PageStyles.Page} wrap={true}>
            <Text style={TextStyles.headerText}>Relatório de Visita Técnica</Text>
            <View>
              {/* CNAE */}
              <View style={[TableStyles.cellTitle, { marginBottom: 5 }]}>
                <Text style={TextStyles.simpleText}>CNAE: <Text style={TextStyles.paragraph}>{item.subclasse_cnae}</Text></Text>
              </View>
              {/* Processos */}
              <View style={{ marginLeft: 10 }}>
                {item.processos && item.processos.map((processo, idx) => (
                  <View key={idx} style={{ marginLeft: 10 }}>
                    <Text style={TextStyles.simpleText}>Processo:</Text>
                    <View style={[TableStyles.cell, { marginBottom: 5 }]}>
                      <View style={TableStyles.checkbox}></View>
                      <Text style={TextStyles.listItem}> {processo.nome}</Text>
                    </View>
                    {/* Riscos */}
                    <View style={{ marginLeft: 10 }}>
                      {processo.riscos && processo.riscos.map((risco, i) => (
                        <View key={i} style={{ marginLeft: 10 }}>
                          <Text style={TextStyles.simpleText}>Risco:</Text>
                          <View style={[TableStyles.cell, { marginBottom: 5 }]}>
                            <View style={TableStyles.checkbox}></View>
                            <Text style={TextStyles.listItem}> {risco.nome}</Text>
                          </View>
                          {/* Medidas */}
                          <View style={{ marginLeft: 10 }}>
                            <Text style={[TextStyles.simpleText, { marginLeft: 10 }]}>Medidas:</Text>
                            {risco.medidas && risco.medidas.map((medida, ind) => (
                              <View key={ind} style={{ marginLeft: 10 }}>
                                <View style={[TableStyles.cell, { marginBottom: 2 }]}>
                                  <View style={TableStyles.checkbox}></View>
                                  <Text style={TextStyles.listItem}> {medida.descricao}</Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </Page>
        ))}
      </>
    );
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

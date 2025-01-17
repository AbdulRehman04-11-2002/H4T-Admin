import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../../assets/images/logo192.png'
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems:'center',
    width:'100%'
  },
  section: {
    padding: 20,
    margin:1,
  },
  logo: {
    width: 60,
    height: 60
  },
  icon: {
    width:20,
    height:20
  },
  qrCode: {
    width: 250,
    height: 250
  },
  ySpacing: {
    marginTop:10,
    marginBottom:10
  },
  clinicName: {
    textDecoration:'underline',
    textAlign:'center',
    fontWeight:'bold',
    fontSize:24,
    color:'#183A59'
  },
  streetAddress: {
    textAlign:'center',
    color:"#183A59",
    fontSize:18,
    fontWeight:0
  },
  walkinHeading: {
    textAlign:'center',
    fontWeight:'bold',
    fontSize:24,
    color:"#183A59"
  },
  walkinText: {
    paddingLeft:20,
    paddingRight:20,
    lineHeight:1.5,
    color:"#183A59",
    textAlign:'center',
    fontSize:18,
    fontWeight:0
  }
});

interface MyDocumentProps {   
    clinicName: string
    streetAddress: string
    qrCodeUrl:string
    walkinInstructions: string
}

export const MyDocument = ({ qrCodeUrl,clinicName, streetAddress, walkinInstructions }: MyDocumentProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
        <View style={{alignSelf:'center'}}>
        <Image style={styles.logo} src={logo} />
        </View>
        <View style={[{marginTop:30, marginBottom:10, alignSelf:'center'}]}>
          <Text style={styles.clinicName}>{clinicName}</Text>
        </View>
        <View style={[{ marginBottom:30, alignSelf:'center'}]}>
          <Text style={styles.streetAddress}>{streetAddress}</Text>
        </View>
        <View style={[{marginBottom:35, alignSelf:'center'}]}>
          {qrCodeUrl && <Image style={styles.qrCode} src={qrCodeUrl} />}
        </View>
        {walkinInstructions && <><View style={[{ alignSelf:'center'}]}>
          <Text style={styles.walkinHeading}>{"Walk-in instructions"}</Text>
        </View>
        <View style={[{ alignSelf:'center', marginTop:20}]}>
        <Text style={styles.walkinText}>{walkinInstructions}</Text>
        </View></>}
        </View>
        
      </Page>
    </Document>
  );
};
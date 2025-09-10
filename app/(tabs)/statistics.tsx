import { View, Text, useColorScheme } from 'react-native';
import { createGlobalStyles } from '../../styles/global';



export default function StatisticsScreen() {
const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';

const styles = createGlobalStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Statistics</Text>
    </View>
  );
}

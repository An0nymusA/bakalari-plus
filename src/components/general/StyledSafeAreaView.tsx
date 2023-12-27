import { SafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'tamagui'

export const StyledSafeAreaView = styled(SafeAreaView, {
    name: 'MySafeAreaView',
    flex: 1,
    backgroundColor: '$background'
})

import { Toast } from "native-base"

export const toast = {
  success: (message: string) => {
    Toast.show({
      title: message,
      placement: 'top',
      bgColor: 'green.500',
    })
  },
  error: (message: string) => {
    Toast.show({
      title: message,
      placement: 'top',
      bgColor: 'red.500',
    })
  }
}
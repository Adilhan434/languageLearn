import { View, Pressable, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Audio } from 'expo-av'

const Footer = () => {
  const router = useRouter()
  const { lessonName, sceneId } = useLocalSearchParams<{
    lessonName: string
    sceneId: string
  }>()

  const currentId = parseInt(sceneId || '1', 10)
  const sound = useRef(new Audio.Sound())
  const [isPlaying, setIsPlaying] = useState(false)

  const handleNext = () => {
    if(currentId != 6){
    router.push(`/lesson/${lessonName}/${currentId + 1}`)
    }else{
      router.push(`/lesson/${lessonName}/1`)

    }
  }

  const handlePrevious = () => {
    if (currentId > 1) {
      router.push(`/lesson/${lessonName}/${currentId - 1}`)
    }
  }



  return (
    <View className='flex-row px-10 py-5 w-full h-[13vh] bg-primary items-center justify-between'>
      {/* Назад */}
      <Pressable onPress={handlePrevious}>
        <Image source={require('@/assets/icons/previous.png')} />
      </Pressable>

      {/* Аудио: Плей/Пауза */}
      {currentId >= 2 && currentId <= 6 ? (
        <Pressable >
          <Image
            source={
              isPlaying
                ? require('@/assets/icons/pause.png') // иконка паузы
                : require('@/assets/icons/play.png') // иконка воспроизведения
            }
            style={{ width: 40, height: 40 }}
          />
        </Pressable>
      ) : (
        <View style={{ width: 40, height: 40 }} />
      )}

      {/* Вперёд */}
      <Pressable onPress={handleNext}>
        <Image source={require('@/assets/icons/next.png')} />
      </Pressable>
    </View>
  )
}

export default Footer

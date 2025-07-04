import { View, Text } from 'react-native'
import React from 'react'
import Header from '@/components/ForHome/Header'
import Cards from '@/components/ForHome/Cards'

const index = () => {
  return (
    <View className='flex-1'>  
        <Header/>
        <Cards/>
    </View>
  )
}

export default index
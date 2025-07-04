import React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LessonCard from './LessonCard';
import { path } from '@/lessonRelated.js';
import { Link } from 'expo-router';

const Cards = () => {
  const insets = useSafeAreaInsets(); // получаем отступы от SafeArea

  const renderItem = ({ item }: any) => {
    const [key, value] = Object.entries(item)[0];
    return (
      <Link href={`/lesson/${key}/1`}>
        <LessonCard letter={`${value}`} />
      </Link>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={path}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        className="px-1 pt-[6vh]" // Tailwind от NativeWind
        contentContainerStyle={{
          paddingBottom: insets.bottom + 15, // Учитываем нижнюю безопасную зону + дополнительный отступ
          rowGap: 1,
        }}
        style={{ flex: 1 }} // Ensure FlatList takes full available space
      />
    </SafeAreaView>
  );
};

export default Cards;
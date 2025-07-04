import { View, Text, StyleSheet, Switch } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { lessons } from '@/lessonRelated.js';
import HeaderForLesson from '@/components/forLesson/HeaderForLesson';
import Footer from '@/components/forLesson/Footer';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Button } from 'react-native';
import { Audio } from 'expo-av';

const SceneId = () => {
    const { lessonName, sceneId } = useLocalSearchParams();
    const id = parseInt(sceneId as string, 10); // Added radix for safer parsing
    const scene = lessons[lessonName as keyof typeof lessons]?.[id];
    const title = lessons[lessonName as keyof typeof lessons]?.[0] as string;
    const [isEnabled, setIsEnabled] = useState(true);
    const audioRef = useRef(new Audio.Sound());

    // Validate lessonName and sceneId
    if (!lessonName || isNaN(id)) {
        return (
            <View style={styles.center}>
                <Text>Неверные параметры сцены</Text>
            </View>
        );
    }

    // Handle case where scene doesn't exist
    if (!scene) {
        return (
            <View style={styles.center}>
                <Text>Сцена не найдена</Text>
            </View>
        );
    }

    // Video Scene (id === 1)
    if (id === 1) {

        const videoSource = scene.video;
        const player = useVideoPlayer(videoSource, (player) => {
            player.loop = true;
            player.play();
        });

        const [isPlaying, setIsPlaying] = useState(player.playing);

        // Listen to playing state changes
        useEffect(() => {
            const subscription = player.addListener('playingChange', ({ isPlaying }) => {
                setIsPlaying(isPlaying);
            });
            return () => subscription.remove();
        }, [player]);

        return (
            <View className="flex-1">
                <HeaderForLesson header={title} />
                <View className="flex-1 justify-center items-center">
                    <VideoView
                        className="w-[350px] h-[275px]"
                        player={player}
                        allowsFullscreen
                        allowsPictureInPicture
                    />
                    <Button
                        title={isPlaying ? 'Pause' : 'Play'}
                        onPress={() => {
                            if (isPlaying) {
                                player.pause();
                            } else {
                                player.play();
                            }
                        }}
                    />
                </View>
                <Footer />
            </View>
        );
    }

    // Text and Audio Scenes (id from 2 to 6)
    if (id >= 2 && id <= 6) {
        useEffect(() => {
            const playAudio = async () => {
                if (!isEnabled || !scene.audio) return;

                try {
                    await audioRef.current.unloadAsync();
                    await audioRef.current.loadAsync(scene.audio);
                    await audioRef.current.playAsync();
                } catch (err) {
                    console.warn('Ошибка при воспроизведении аудио:', err);
                }
            };

            playAudio();

            return () => {
                audioRef.current.unloadAsync();
            };
        }, [sceneId, isEnabled]);

        return (
            <View className="flex-1">
                <HeaderForLesson header={title} />
                <View className="flex-1 justify-start gap-[25vh] pt-5 items-center">
                    {scene.explain && <Text className="text-center px-4">{scene.explain}</Text>}
                    <Text className="text-black font-noto font-extrabold text-[52px]">{scene.text}</Text>
                </View>
                <View className="justify-center items-center flex-row gap-3 pb-10">
                    <Text>Автовоспроизведение:</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#ffff' : '#6366F1'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setIsEnabled((prev) => !prev)}
                        value={isEnabled}
                    />
                </View>
                <Footer />
            </View>
        );
    }

    return (
        <View style={styles.center}>
            <Text>Неизвестная сцена</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SceneId;
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Tldraw, TldrawEditor } from '@tldraw/tldraw';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import 'tldraw/tldraw.css';

export default function HomeScreen() {
  const [isMounted, setIsMounted] = useState(false);
  const [editor, setEditor] = useState<TldrawEditor | null>(null); // 存储 `TldrawEditor` 实例

  useEffect(() => {
    setIsMounted(true);
	if (!editor) {
		console.warn("TldrawEditor 未初始化，尝试重新赋值...");
	  } else {
		console.log("TldrawEditor 初始化成功", editor);
	  }
  }, [editor]);

  return (
    <View style={styles.container}>
      {isMounted && (
        <Tldraw
		onMount={(editorInstance: TldrawEditor) => {
		  setTimeout(() => setEditor(editorInstance));
		}}
	  />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    gap: 10,
  },
});

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
		console.warn("❌ TldrawEditor 未初始化，尝试重新赋值...");
	  } else {
		console.log("✅ TldrawEditor 初始化成功", editor);
	  }
  }, [editor]);

  /** 将图片添加到 Tldraw 画布，并自动旋转 -45° */
  const addImageToCanvas = (imageUri: string) => {
	if (!editor) return;
	console.log("addImageToCanvas")

	const assetId = `asset:${Date.now()}`;
	const imageAsset = {
		id: assetId, // ✅ 这里手动添加 `id`
		type: 'image',
		props: {
		  src: imageUri, // ✅ 图片路径
		  w: 200, // ✅ 图片宽度
		  h: 200, // ✅ 图片高度
		  fileSize: 0,
		  isAnimated: false,
		  mimeType: 'image/png',
		  name: `image_${Date.now()}.png`,
		},
	  };
	
	  // 3️⃣ 使用 `createAssets()` 注册 `image` 资源
	  editor.createAssets([imageAsset]);

	editor.createShape({
	  id: `shape:${Date.now()}`,
	  type: 'image',
	  x: 100, // 初始位置
	  y: 100,
	  rotation: -45, // 旋转 45°
	  props: {
		assetId: assetId,
	  },
	});
  };
  
  /** 选择图片并上传到 Tldraw 画布 */
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      addImageToCanvas(result.assets[0].uri);
    }
  };

  /** 下载当前 Tldraw 画布为图片 */
  const downloadCanvas = async () => {
    if (!editor) return;

    // 导出画布为 Blob
    const imageBlob = await editor.exportToBlob();
    if (!imageBlob) return;

    // 生成本地文件路径
    const fileUri = FileSystem.documentDirectory + 'canvas.png';

    // 将 Blob 写入本地文件
    await FileSystem.writeAsStringAsync(fileUri, imageBlob, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 允许用户下载或分享
    await Sharing.shareAsync(fileUri);
  };

  return (
    <View style={styles.container}>
      {isMounted && (
        <Tldraw
		onMount={(editorInstance: TldrawEditor) => {
		  setTimeout(() => setEditor(editorInstance));
		}}
		onAssetCreate={(asset) => {
			console.log("📷 Tldraw 上传图片的 asset 详情:", asset);
		  }}
	  />
      )}
      <View style={styles.buttonContainer}>
        <Button title="上传图片" onPress={pickImage} />
        <Button title="下载画布" onPress={downloadCanvas} />
      </View>
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

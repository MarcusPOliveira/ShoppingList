import React, { useState, useEffect } from 'react';
import { FlatList, ToastAndroid } from 'react-native';
import storage from '@react-native-firebase/storage';

import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';
import { File, FileProps } from '../../components/File';
import { Container, PhotoInfo } from './styles';

export function Receipts() {
  const [photos, setPhotos] = useState<FileProps[]>([]);
  const [photoSelected, setPhotoSelected] = useState('');
  const [photoInfo, setPhotoInfo] = useState('');

  //listagem das imagens no Storage
  async function fetchImages() {
    storage().ref('images').list().then(result => {
      const files: FileProps[] = [];
      result.items.forEach(file => {
        files.push({
          name: file.name,
          path: file.fullPath
        });
      });
      setPhotos(files);
    });
  }

  async function handleShowImage(path: string) {
    //seleção e exibição da imagem
    const urlImage = await storage().ref(path).getDownloadURL();
    setPhotoSelected(urlImage);
    //exibição de informação sobre a imagem (data de upload, nome, etc)
    const info = await storage().ref(path).getMetadata();
    setPhotoInfo(`Upload realizado em: ${info.timeCreated}`);
  }

  async function handleDeleteImage(path: string) {
    storage()
      .ref(path)
      .delete()
      .then(() => {
        ToastAndroid.show('Imagem excluída com sucesso!', ToastAndroid.LONG);
        fetchImages();
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <Container>
      <Header title="Comprovantes" />
      <Photo uri={photoSelected} />
      <PhotoInfo>
        {photoInfo}
      </PhotoInfo>
      <FlatList
        data={photos}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <File
            data={item}
            onShow={() => handleShowImage(item.path)}
            onDelete={() => handleDeleteImage(item.path)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', padding: 24 }}
      />
    </Container>
  );
}

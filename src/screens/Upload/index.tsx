import React, { useState } from 'react';
import { ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';

import { Container, Content, Progress, Transferred } from './styles';

export function Upload() {
  const [image, setImage] = useState('');
  const [bytesTransferred, setBytesTransferred] = useState('');
  const [progress, setProgress] = useState('0');

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status == 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  }

  async function handleUpload() {
    const fileName = new Date().getTime(); //pegando data e hora atual para definir o nome do arquivo
    const reference = storage().ref(`/images/${fileName}.png`); //onde serão salvas as imagens dentro do Storage do Firebase
    const uploadTask = reference.putFile(image);

    uploadTask.on('state_changed', taskSnapshot => { //listener para ficar "escutando" a progressão do upload
      const percent = ((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100).toFixed(0);
      setProgress(percent);
      setBytesTransferred(`${taskSnapshot.bytesTransferred} transferido de ${taskSnapshot.totalBytes}`)
    });

    uploadTask.then(async () => {  //verificando quando o upload é finalizado
      const imageUrl = await reference.getDownloadURL();
      ToastAndroid.show('Upload concluído com sucesso!', ToastAndroid.LONG)
    })

    /* //upload sem progressão de upload
      reference
        .putFile(image) //fazendo upload passando o estado "image" que armazena a uri da imagem selecionada
        .then(() => ToastAndroid.show('Upload concluído!', ToastAndroid.LONG))
        .catch((error) => console.error(error));
    */
  }

  return (
    <Container>
      <Header title="Upload de fotos" />
      <Content>
        <Photo uri={image} onPress={handlePickImage} />
        <Button
          title="Fazer upload"
          onPress={handleUpload}
        />
        <Progress>
          {progress}%
        </Progress>
        <Transferred>
          {bytesTransferred}
        </Transferred>
      </Content>
    </Container>
  );
}

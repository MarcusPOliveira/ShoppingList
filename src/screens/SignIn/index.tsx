import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';

import { Container, Account, Title, Subtitle } from './styles';
import { ButtonText } from '../../components/ButtonText';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ToastAndroid } from 'react-native';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //sign in anonimo
  async function handleSignInAnonymously() {
    const { user } = await auth().signInAnonymously();
  }

  //login com email e senha
  function handleCreateUserAccount() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => ToastAndroid.show('Usuário criado com sucesso!', ToastAndroid.LONG))
      .catch(error => { //tratamento de erros ao criar conta
        console.log(error.code);
        if (error.code === 'auth/email-already-in-use') {
          return ToastAndroid.show('Este email já está em uso! Digite outro email para cadastrar!', ToastAndroid.LONG);
        }
        if (error.code === 'auth/invalid-email') {
          return ToastAndroid.show('Email inválido!', ToastAndroid.LONG);
        }
        if (error.code === 'auth/weak-password') {
          return ToastAndroid.show('A senha deve conter no mínimo 6 dígitos!', ToastAndroid.LONG);
        }
      })
  }

  return (
    <Container>
      <Title>MyShopping</Title>
      <Subtitle>monte sua lista de compra te ajudar nas compras</Subtitle>

      <Input
        placeholder="e-mail"
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      <Input
        placeholder="senha"
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Entrar" onPress={handleSignInAnonymously} />

      <Account>
        <ButtonText title="Recuperar senha" onPress={() => { }} />
        <ButtonText title="Criar minha conta" onPress={handleCreateUserAccount} />
      </Account>
    </Container>
  );
}
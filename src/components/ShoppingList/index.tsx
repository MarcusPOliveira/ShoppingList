import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { styles } from './styles';
import { Product, ProductProps } from '../Product';

export function ShoppingList() {
  const [products, setProducts] = useState<ProductProps[]>([]);

  //Lendo e exibindo (em tempo real) vários Docs
  useEffect(() => {
    const subscribe = firestore()
      .collection('products')
      .onSnapshot(querySnapshot => { //evento de listener ('escutando' as alterações na aplicação)
        //percorrendo cada Doc da Coleção
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as ProductProps[];
        setProducts(data);
      })
    return () => subscribe(); //onSnapshot retorna uma função de limpeza
  }, []);

  //Exemplos de funcionalidades para consultas ao Firestore

  /*
  //Lendo e exibindo (uma única vez) um único Doc
  useEffect(() => {
    firestore()
      .collection('products')
      .doc('9iFawau0FQYbgg3rNt3H') //id do Doc de forma estática
      .get()
      .then(response => console.log({
        id: response.id,
        ...response.data()
      })); //console => {"description": "Toddy", "done": false, "id": "9iFawau0FQYbgg3rNt3H", "quantity": 1}
  }, []);
  */

  /*
  //Lendo e exibindo (uma única vez) vários Docs
  useEffect(() => {
    //ler os Documentos da Coleção e carregá-los no array de produtos do State para listar na FlatList
    firestore()
      .collection('products')
      .get()
      .then(response => {
        //percorrer cada Documento para retornar o ID do Doc e os dados 
        const data = response.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as ProductProps[];
        setProducts(data);
      })
      .catch(error => console.error(error));
  }, []);
  */

  /*
  //Filtrando as consultas ao Firestore
  useEffect(() => {
    const subscribe = firestore()
      .collection('products')
      //.orderBy('description', 'asc) //ordenando por ordem alfabetica
      //.limit(3) //limita a quantidade de Docs retornados pela consulta
      .where('quantity', '==', 1) //filtrando produtos em que a quantidade = 1
      .onSnapshot(querySnapshot => { //evento de listener ('escutando' as alterações na aplicação)
        //percorrendo cada Doc da Coleção
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as ProductProps[];
        setProducts(data);
      })
    return () => subscribe(); //onSnapshot retorna uma função de limpeza
  }, []);
  */

  /*
  //Aplicando filtro nas consultas baseado em um intervalo
  useEffect(() => {
    const subscribe = firestore()
      .collection('products')
      .orderBy('quantity')
      .startAt(2) // >= 2 (utilizar startAfter() para contar a partir do numero desejado)
      .endAt(3) // <=3
      .onSnapshot(querySnapshot => { //evento de listener ('escutando' as alterações na aplicação)
        //percorrendo cada Doc da Coleção
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as ProductProps[];
        setProducts(data);
      })
    return () => subscribe(); //onSnapshot retorna uma função de limpeza
  }, []);
  */

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <Product data={item} />}
      showsVerticalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.content}
    />
  );
}

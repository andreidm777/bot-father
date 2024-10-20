bridge.send('VKWebAppCreateHash', {payload: values})
  .then((data) => { 
    if (data.sign) {
      // Подпись сгенерирована:
      // data.sign — подпись,
      // data.ts — время создания подписи 

      // Отправить подпись и время создания на сервер
      // https://example.com/?data=values&sign=data.sign&sign_ts=data.ts
    }
  })
  .catch((error) => {
    // Ошибка
    console.log(error);
  });
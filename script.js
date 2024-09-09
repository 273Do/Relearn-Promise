// 参考：https://qiita.com/cheez921/items/41b744e4e002b966391a#%E3%81%AF%E3%81%98%E3%82%81%E3%81%AB
// ターミナルでの実行：node script.js

// MEMO: 1,3,2の順番で表示される
const whatIsPromise = () => {
  console.log("1番目");

  // 1秒後に実行する処理
  setTimeout(() => {
    console.log("2番目(1秒後に実行)");
  }, 1000);

  console.log("3番目");
};
// whatIsPromise();

// MEMO: 1,2,3の順番で表示される
const thisIsPromise = () => {
  console.log("1番目");

  // お約束を取り付けたい処理にPromise
  new Promise((resolve) => {
    //1秒後に実行する処理
    setTimeout(() => {
      console.log("2番目(1秒後に実行)");
      //無事処理が終わったことを伝える
      resolve();
    }, 1000);
  }).then(() => {
    // 処理が無事終わったことを受けとって実行される処理
    console.log("3番目");
  });
};
// thisIsPromise();

// NOTE: PromiseにはPromiseStatusというstatusがあり，３種類存在する．
// pending: 未解決 - 初期状態 (処理が終わるのを待っている状態)
// resolved: 解決済み (処理が終わり，無事成功した状態)
// rejected: 拒否 (処理が失敗に終わってしまった状)

// new Promise()で作られたPromiseオブジェクトは、pendingというPromiseStatusで作られる．
// 処理が成功した時にPromiseStatusはfulfilledに変わり,thenに書かれた処理が実行される．
// 処理が失敗した時にPromiseStatusはrejectedに変わり,catchに書かれた処理が実行される．

// MEMO: 使い方
const howToUsePromise = (mode) => {
  if (mode == "normal") {
    // Promiseインスタンスの作成(基本形)
    //   第一引数にはresolve関数を，第二引数にはreject関数を任意で渡す．
    const promise = new Promise((resolve, reject) => {});
    console.log(promise); // PromiseStatusは，pending
    //
    //
    //
  } else if (mode == "resolve") {
    // rejectは今回使わないため，引数から削除
    const promise = new Promise((resolve) => {
      resolve("resolveしたよ"); // resolveさせる
    }).then((val) => {
      // resolveの引数がthenの第一引数に入る
      //   console.log("resolveしたよ");
      console.log(val);
      console.log(promise); // PromiseStatusは，fulfilled
    });
    //
    //
    //
  } else if (mode == "reject") {
    const promise = new Promise((resolve, reject) => {
      reject(); // rejectさせる
    })
      .then(() => {
        console.log("resolveしたよ");
      })
      .catch(() => {
        // thenではなくcatchが実行される
        console.log("rejectしたよ");
        console.log(promise); // PromiseStatusは，fulfilled
        // NOTE: catchにて実行される関数がreturnした値をresolveします．
        // めcatchはエラー返したら満足して，解決済みだ！ってするみたい．
      });
  }
};
// howToUsePromise("reject");

// MEMO: Promiseのメソッドチェーン
const promiseMethodChain = () => {
  const promise = new Promise((resolve, reject) => {
    // resolve("test");
    reject("test");
  })
    .then((val) => {
      console.log(`then1: ${val}`);
      return val + " resolve";
    })
    .catch((val) => {
      console.log(`catch: ${val}`);
      return val + " catch";
    })
    .then((val) => {
      // NOTE: thenやcatchの後でもthenやcatchを繋げることができる
      // thenやcatchの中でreturnされた値が次のthenの引数として渡される
      console.log(`then2: ${val}`);
    });
};
// promiseMethodChain();

// MEMO: Promise.allとPromise.raceの使い方
const promiseAll = (mode) => {
  const promise1 = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    console.log("promise1おわったよ！");
  });

  const promise2 = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  }).then(() => {
    console.log("promise2おわったよ！");
  });

  if (mode == "promiseAll") {
    // NOTE: 全てのPromiseオブジェクトがresolvedになったら次の処理に進む．
    Promise.all([promise1, promise2]).then(() => {
      console.log("全部おわったよ！");
    });
    //
    //
    //
  } else if (mode == "promiseRace") {
    // NOTE: いずれかのPromiseオブジェクトがresolvedになったら次の処理に進む．
    Promise.race([promise1, promise2]).then(() => {
      console.log("どれか一つおわったよ！");
    });
  }
};
// promiseAll("promiseRace");

// MEMO: async/awaitの使い方1
// Promiseの処理は，Promiseインスタンスを生成してresolveやrejectをしたりするためちょっと面倒．
// async/awaitを使うと，Promiseを使った処理を簡潔に書ける．
const asyncAwait = () => {
  const preAlwaysLateBoy = (ms) => {
    new Promise((resolve) => {
      console.log("start");
      setTimeout(() => {
        resolve();
      }, ms);
    }).then(() => {
      console.log(`すまん！${ms}ms待たせたな。`);
    });
  };
  //
  //
  //
  // async/awaitを使ってリファクタリング
  // asyncは非同期関数を定義する関数宣言
  // async functionが値をreturnした場合，Promiseは戻り値をresolveする
  const alwaysLateBoy = async (ms) => {
    // awaitはPromiseオブジェクトが値を返すのを待つ演算子
    await new Promise((resolve) => {
      console.log("start");
      setTimeout(() => {
        resolve();
      }, ms);
    });
    // Promiseの結果が返ってくるまで実行されない
    console.log(`すまん！${ms}ms待たせたな。`);
  };

  alwaysLateBoy(1000);
};
// asyncAwait();

// MEMO: async/awaitの使い方2
const asyncAwait2 = () => {
  const asyncFunc = async () => {
    let x, y;
    x = new Promise((resolve) => {
      console.log("x");
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
    y = new Promise((resolve) => {
      console.log("y");
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
    // 上二つのPromiseオブジェクトがresolveするのを待たれずに実行されるのでエラーになる．
    console.log(x + y);
  };

  const asyncFunc2 = async () => {
    let x, y;
    x = await new Promise((resolve) => {
      console.log("x");
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
    y = await new Promise((resolve) => {
      console.log("y");
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
    // 上二つのPromiseオブジェクトがresolveするのを待つので正しく実行される．
    console.log(x + y);
  };

  asyncFunc();
  asyncFunc2();
};
asyncAwait2();

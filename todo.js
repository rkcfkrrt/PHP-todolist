/* eslint-disable max-len, no-undef, no-useless-escape, prefer-template, camelcase, no-unused-vars, no-alert, no-shadow */

$(document).ready(() => {
  const todoUrl = 'http://rkcfkrrt.tw/todo/';
  const newOne = `
    <div class="form-check">
      <span class="form-check-item">
        <input type="hidden" class="done" name="done" value="0">
        <input class="form-check-checkbox" type="checkbox">
        <label class="form-check-label">{content}</label>
      </span>
      <span class="delete" title="刪除！">✘</span>
    </div>
  `;

  function escape(toOutput) {
    return toOutput.replace(/\&/g, '&amp;')
      .replace(/\</g, '&lt;')
      .replace(/\>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#x27')
      .replace(/\//g, '&#x2F');
  }

  function addOne(content) {
    const getList = newOne.replace('{content}', escape(content));
    const li = document.createElement('li');
    $(li).addClass('list-group-item');
    li.innerHTML = getList;
    $('.list-group').append(li);
    return li;
  }

  function saveTodo() {
    const sendContent = document.querySelectorAll('.form-check-label');
    const done = document.querySelectorAll('.done');
    const newSaveTodo = [];
    for (let i = 0; i < sendContent.length; i += 1) {
      newSaveTodo.push({
        content: sendContent[i].textContent,
        done: done[i].value,
      });
    }
    return JSON.stringify(newSaveTodo);
  }

  function countChecked() {
    $('.count').empty();
    const count = ($('.list-group-item').length - $('.isChecked').length);
    $('.count').append('共有&nbsp;' + count + '&nbsp;個未完成項目');
  }

  // 隨機產生 ID
  function genID(length) {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
  }

  function saveAjax(data, storage_id) {
    $.ajax({
      type: 'POST',
      url: todoUrl + 'add_todo.php',
      data: {
        todo: data,
        storage_id,
      },
      success: (res) => {
        const saveUrl = todoUrl + 'todo.html?id=' + storage_id;
        window.location = 'todo.html?id=' + storage_id;
        alert('請複製此 URL 連結（即本頁 URL）：' + saveUrl + '，之後可藉由此連結開啟已儲存 TODO（￣︶￣）↗');
      },
      error: () => {
        alert('儲存失敗 (っ °Д °;)っ');
      },
    });
  }

  // 新增 todo
  $('.submit').click((e) => {
    e.preventDefault();
    if ($('.input-content').val() !== '') {
      const content = $('.input-content').val();
      // 新增到 list
      const li = addOne(content);
      // 清空輸入欄
      $('.input-content').val('');
      countChecked();
    } else {
      alert('請輸入內容');
    }
  });

  // 編輯：如雙擊該條 todo（1），則隱藏原本的 li（2） -> 出現編輯用的 input（3） -> 送出後 把修改好的內容放回去（4）
  $('.list-group').delegate('.form-check-label', 'dblclick', (e) => {
    $(e.target).closest('span').addClass('form-check-value');
    $(e.target).closest('label').addClass('form-check-edit');
    $(e.target).closest('.form-check-item').toggle();
    // （3）
    const value = $('.form-check-edit').html();
    const div = document.createElement('div');
    $(div).addClass('edit');
    div.innerHTML = `
      <input type="text" class="form-check-input" value="${value}">
    `;
    $('.form-check-value').next('.delete').before(div);
    // （4）監聽該輸入框，如按下 enter
    $('.list-group').delegate('.form-check-input', 'keydown', (e) => {
      if (e.which === 13) {
        const editValue = $('.form-check-input').val();
        const newEdit = newOne.replace('{content}', escape(editValue));
        // 先清空該條的 li 再把新的值和元素放進去
        $('.form-check-edit').closest('li').addClass('newLi');
        $('.form-check-edit').closest('li').empty();
        $('.newLi').append(newEdit);
        $('.newLi').removeClass('newLi');
      }
    });
  });

  // 刪除單條 todo
  $('.list-group').delegate('.delete', 'click', (e) => {
    $(e.target).closest('li').remove();
    countChecked();
  });

  // 清空全部 todo
  $('.btn-danger').click(() => {
    $('.list-group').empty();
    countChecked();
  });

  // 清除已完成的 todo
  $('.btn-info').click(() => {
    $('.isChecked').remove();
  });

  // 已完成的 todo 加上 "isChecked"，幫助篩選
  $('.list-group').delegate('.form-check-checkbox', 'click', (e) => {
    const check = $(e.target).closest('li');
    check.toggleClass('isChecked');
    // 根據是否 checked 變更 value 的值使儲存時可用於紀錄該 todo 完成狀態
    const doneValue = $(e.target).prev('.done');
    if (e.target.checked) {
      // 1：已完成；0：未完成
      doneValue.val(1);
    } else {
      doneValue.val(0);
    }
  });

  // 篩選 todo nav-tabs
  $('.nav-item').click((e) => {
    $('.active').removeClass('active');
    $(e.target).closest('a').addClass('active');
    const all = document.querySelectorAll('.list-group-item');
    const isChecked = document.querySelectorAll('.isChecked');
    if ($('.li-all').hasClass('active')) {
      $(all).show();
    }
    if ($('.li-done').hasClass('active')) {
      $(all).hide();
      $(isChecked).show();
    }
    if ($('.li-notyet').hasClass('active')) {
      $(all).show();
      $(isChecked).hide();
    }
  });

  countChecked();
  $('.list-group').change(() => {
    countChecked();
  });

  // 儲存
  $('.save').click((e) => {
    const storage_id = (genID(1));
    const data = saveTodo();
    saveAjax(data, storage_id);
  });

  // 確認網址是否帶有 storage_id
  if (window.location.search) {
    const search = new URLSearchParams(window.location.search);
    const searchId = search.get('id');// 取得 id 的值
    // 顯示
    $.getJSON(todoUrl + 'get_todo.php?id=' + searchId, (data) => { 
      const todos = JSON.parse(data.data.todo);
      console.log(todos)//看一下
      $('.list-group').empty();
      for (let j = 0; j < todos.length; j += 1) {
        const li = addOne(todos[j].content);
        if (todos[j].done === '1') {
          $(li).addClass('isChecked');
          $(li).find('input.done').val(1);
          $(li).find('input.form-check-checkbox').prop('checked', true);
        }
      }
      countChecked();
    });
  }
});

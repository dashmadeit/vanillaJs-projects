'use strict';

// 1) Grab elements
const input = document.getElementById('todo-field');
const addBtn = document.getElementById('add-task');
const list = document.getElementById('list');
const countOne = document.getElementById('count-one')  // remaining
const countTwo = document.getElementById('count-two')  // total
const removeCompletedBtn = document.getElementById('removed-items')



// 2) Wire events
addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// 3) Action
function addTask() {
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement('li');
  li.innerHTML = `
    <label>
      <input type="checkbox" class="todo-check">
      <span class="todo-text">${text}</span>
    </label>
  `;
  list.appendChild(li);
  input.value = '';
  console.log('added:', text); // debug line

  updateCounts()

}

list.addEventListener('change', function (e) {
  // ignore other changes
  if (!e.target.matches('input.todo-check')) return

  const li = e.target.closest('li')
  li.classList.toggle('completed', e.target.checked)

  updateCounts()

})

list.addEventListener('click', function (e) {
  if (!e.target.matches('.todo-text')) return
  startEdit(e.target)
})


function startEdit(span) {
  const oldText = span.textContent
  const input = document.createElement('input')
  input.type = 'text'
  input.value = oldText
  input.className = 'edit-input'

  // replace span with input
  span.replaceWith(input)
  input.focus()
  input.select()

  // save on blur
  input.addEventListener('blur', function () {
    finishEdit(input)
  })

  // save on Enter, cancel on Escape
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      finishEdit(input)
    }
    if (e.key === 'Escape') {
      cancelEdit(input, oldText)
    }
  })
}

function finishEdit(input) {
  const newText = input.value.trim()
  const span = document.createElement('span')
  span.className = 'todo-text'
  span.textContent = newText || 'Untitled task'
  input.replaceWith(span)
  updateCounts()
}

function cancelEdit(input, oldText) {
  const span = document.createElement('span')
  span.className = 'todo-text'
  span.textContent = oldText
  input.replaceWith(span)
}



function updateCounts() {
  const allItems = list.querySelectorAll('li')
  const allCheckboxes = list.querySelectorAll('input.todo-check')

  const total = allItems.length
  let remaining = 0

  allCheckboxes.forEach(box => {
    if (!box.checked) remaining++
  })

  countTwo.textContent = total
  countOne.textContent = remaining
}

removeCompletedBtn.addEventListener('click', removeCompleted)
function removeCompleted() {
  const items = list.querySelectorAll('li')

  items.forEach(li => {
    const box = li.querySelector('input.todo-check')
    if (box && box.checked) {
      li.remove()
    }
  })

  updateCounts()
}

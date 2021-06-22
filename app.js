
/*------------ Construtores ------------*/


// Construtor livro
function Livro (titulo, autor, isbn) {
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
}


// Construtor da interface -> adicionar livro, excluir livro (tudo que será visto na tela)
function UI() {}



//prototype adiciona uma nova propriedade para um objeto, nesse caso estamos adicionando a função de adicionar livros na lista
UI.prototype.adicionarLivroNaLista = function(livro) {
    const lista = document.getElementById('lista-livros');
    // Criar elemento tr 
    const row = document.createElement('tr');
    // inserir linha na lista
    row.innerHTML = `<td>${livro.titulo}</td>
                     <td>${livro.autor}</td>
                     <td>${livro.isbn}</td>
                     <td><a href="#" class="deletar">x</a></td>
    `;
    lista.appendChild(row);
    
}

// prototype para deletar 

UI.prototype.deletarLivro = function(target){
 if(target.className === 'deletar') {
    target.parentElement.parentElement.remove();
 }
}

// prototype para limpar os campos após o "enviar"

UI.prototype.limparCampos = function() {
    document.getElementById('titulo').value = '' ;
    document.getElementById('autor').value = '';
    document.getElementById('isbn').value = '';
}

// prototype para mostrar alertas
UI.prototype.mostrarAlerta = function(message, className) {
    // criar um div
    const div = document.createElement('div');
    //adicionar classe
    div.className = `alert ${className}`;
    // adicionar texto
    div.appendChild(document.createTextNode(message));
   // pegar um pai para encaixar o elemento
   const container = document.querySelector('.container');
   const form = document.querySelector('#book-form');
   // inserir no container, antes do form :)
   container.insertBefore(div, form);

   //desaparecer após de 3 segundos
   setTimeout(function(){
    document.querySelector('.alert').remove()
   }, 3000);
}
/*------------ STORAGE ------------*/
const store = new Store;
function Store() {}

Store.prototype.pegarLivros = function() {
    // "fetch"
    let livros;
    // checar o storage
    if(localStorage.getItem('livros') === null) {
        livros = [];
    } else {
        livros = JSON.parse(localStorage.getItem('livros'));
    }

    return livros;
}

Store.prototype.mostrarLivros = function() {
    const livros = store.pegarLivros();
        livros.forEach(function(livro) {
            const ui = new UI;
            // adicionar livro na UI
            ui.adicionarLivroNaLista(livro);
        })
}

Store.prototype.adicionarLivro = function(livro) {
    const livros = store.pegarLivros();
        livros.push(livro);
        localStorage.setItem('livros', JSON.stringify(livros));
}
Store.prototype.removerLivro = function(isbn) {
   const livros = store.pegarLivros();
        livros.forEach(function(livro, index) {
            if(livro.isbn == isbn ) {
                livros.splice(index, 1);

            }
        }
        );
        localStorage.setItem('livros', JSON.stringify(livros));
}




/*------------ EVENTOS ------------*/

// evento para colocar na UI os livros que estão no Storage
document.addEventListener('DOMContentLoaded', store.mostrarLivros);

// evento clicar no botão enviar do form
document.getElementById('book-form').addEventListener('submit', function(e){
    // Pegar os valores do form:
    const titulo = document.getElementById('titulo').value, 
    autor = document.getElementById('autor').value, 
    isbn = document.getElementById('isbn').value;

    // instanciar livro
    const livro = new Livro(titulo, autor, isbn); // livro = a um novo objeto Livro (aquela lá da função lá em cima), com os parâmetros do form (titulo, autor e isbn)
   
   /* Exemplo didático:
    caso eu passe os valores -> Título: Harry Potter e as relíquias da morte
                                Autor: J. K. Rowling
                                Isbn: 8532530842
    terei um objeto Livro com essas 3 propriedades, portando se eu der um "console.log(livro);" aparecerá:

    Livro {titulo: "Jk Rowling", autor: "Harry Potter e as Relíquias da Morte", isbn: "8532530842"}
   
   */

   // instanciar elemento da UI
    const ui = new UI();

    // Validar campos -> verificar se estão vazios, e não deixar "passar", caso aconteça
    if(titulo === '' || autor === '' || isbn === '') {
        ui.mostrarAlerta('Por favor, preencha todos os campos', 'error');
         } else {
         // chamar a função de adicionar livro, passando o objeto Livro como parâmetro
        ui.adicionarLivroNaLista(livro);

        // adicionar no localStorage (Não há necessidade de instanciar, pois seus métodos são 'static')
        store.adicionarLivro(livro);

        //mostrar sucesso
        ui.mostrarAlerta('Livro adicionado com sucesso!', 'success');

        // limpar campos
        ui.limparCampos();
    }
    
  

    e.preventDefault();
})

// evento para deletar -> elemento não existe no index original
document.getElementById('lista-livros').addEventListener('click', function(e){
      
    // instanciar elemento da UI
    const ui = new UI();
    // chamar função de deletar
    ui.deletarLivro(e.target);
    // deletar do storage
    store.removerLivro(e.target.parentElement.previousElementSibling.textContent);

    // mostrar alerta

    ui.mostrarAlerta('Livro removido com sucesso!', 'success')
    e.preventDefault();
})

console.log('Essa versão do app.js foi feita sem a utilização do ES6 :)')


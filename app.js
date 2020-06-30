db.collection('reply').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            daftarReply(change.doc);
        } else if (change.type == 'removed'){
            let li = custReply.querySelector('[data-id=' + change.doc.id + ']');
            custReply.removeChild(li);
        }
    })
})



const custReply = document.querySelector('.custreply');

function daftarReply(doc){
  let li = document.createElement('li');
  li.setAttribute('data-id', doc.id);
  let header = doc.data().header;
  let keterangan = doc.data().keterangan;

  li.innerHTML = `<div id="header${doc.id}" class="collapsible-header grey lighten-5 card-panel"> ${header} </div>
        <button id="copas${doc.id}" class="btn waves-effect waves-light btn-large blue darken-2">Copy</button>
        <button id="hapus${doc.id}" class="hapus btn waves-effect waves-light btn-large red lighten-1">x</button>
        <div id="keterangan${doc.id}" class="collapsible-body ${doc.id} white"> ${keterangan} </div>
`
custReply.appendChild(li);


 let copas = document.querySelector("#copas" + doc.id);
 copas.addEventListener('click', function (e) {
    document.querySelector('#header' + doc.id).click();
    var text = document.querySelector("#keterangan" + doc.id);
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
    //add to clipboard.
    document.execCommand('copy');

  });


let hapus = document.querySelector('#hapus' + doc.id);
hapus.addEventListener('click', function(e){
    e.stopPropagation();
    var konfirmasi = confirm('Anda yakin ingin menghapus kalimat ini ?');
    if(konfirmasi ==true){
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('reply').doc(id).delete();
    }
  });




}



const createForm = document.querySelector('#reply-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('reply').add({
        header: createForm['header'].value,
        keterangan: createForm['keterangan'].value.replace(/\n\r?/g, '<br/>') 
    }).then(() => {
        const modal = document.querySelector('#modal-reply');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    })
})
// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});

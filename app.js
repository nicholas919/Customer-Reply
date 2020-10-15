
// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});
$(document).ready(function() {
db.collection('reply').onSnapshot(snapshot =>{
    var items = $('.custreply > li').get();
  items.sort(function(a, b) {
    var keyA = $(a).text();
    var keyB = $(b).text();

    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  var ul = $('.custreply');
  $.each(items, function(i, li) {
    ul.append(li);
  });
  })
})

db.collection('reply').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            daftarReply(change.doc);
        } else if (change.type == 'removed'){
            let li = custReply.querySelector('[data-id=' + change.doc.id + ']');
            custReply.removeChild(li);
        } else if (change.type == 'modified'){
            updateReply(change.doc);
        }
    })
})



const custReply = document.querySelector('#custreply');
const listModalReply = document.querySelector('#list-modal-reply');

function daftarReply(doc){
  let li = document.createElement('li');
  let modal = document.createElement('div');
  modal.setAttribute('id', 'modal-reply' + doc.id);
  modal.classList.add('modal')
  li.setAttribute('data-id', doc.id);
  let header = doc.data().header;
  let keterangan = doc.data().keterangan;

  li.innerHTML = `
        <div id="header-tampilan${doc.id}" class="collapsible-header grey lighten-5 card-panel"> ${header} </div>
        <button id="copas${doc.id}" class="btn waves-effect waves-light btn-large blue darken-2">Copy</button>
        <button id="hapus${doc.id}" class="hapus btn waves-effect waves-light btn-large red lighten-1">x</button>
        <div class="collapsible-body ${doc.id}"> 
        <div id="keterangan-tampilan${doc.id}">${keterangan}</div> 
        <div class="konfigurasi"><a id="edit${doc.id}" class="btn waves-effect waves-light btn-medium amber lighten-1 modal-trigger" data-target="modal-reply${doc.id}">Edit</a> <a id="hapusKedua${doc.id}" class="btn waves-effect waves-light btn-medium red lighten-1">Hapus</a></div>
        </div>
`

  modal.innerHTML = `
    <div class="modal-content">
      <h4 class="center-align">Mengubah Replies</h4>
      <form id="reply-form${doc.id}">
        <div>
        <label>Header</label>
          <input value="${header}" type="text" id="header${doc.id}" autocomplete="off" required/>
        </div>
        <div>
        <label>Keterangan</label>
          <textarea onfocus="auto_grow(this)" id="keterangan${doc.id}" class="materialize-textarea" autocomplete="off" required/>${keterangan.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
        </div>
        <div class="btn red darken-3 z-depth-0 modal-close dismiss">Tutup</div>
        <button type="submit" class="btn blue darken-3 z-depth-0 simpan" onkeyup="submit();">Simpan</button>
      </form>
    </div>
`

custReply.appendChild(li);
listModalReply.appendChild(modal);

 let copas = document.querySelector("#copas" + doc.id);
 copas.addEventListener('click', function (e) {
    document.querySelector('#header-tampilan' + doc.id).click();
    let text = document.querySelector("#keterangan-tampilan" + doc.id);
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
    //add to clipboard.
    document.execCommand('copy');

  });


let hapus = document.querySelector('#hapus' + doc.id);
hapus.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin menghapus kalimat ini ?');
    if(konfirmasi == true){
    db.collection('reply').doc(doc.id).delete();
    }
  });

let hapusKedua = document.querySelector('#hapusKedua' + doc.id);
hapusKedua.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin menghapus kalimat ini ?');
    if(konfirmasi == true){
    db.collection('reply').doc(doc.id).delete();
    }    
});

  let element = document.querySelector('#modal-reply' + doc.id);
  let instance = M.Modal.init(element)

  let formReply = document.querySelector('#reply-form' + doc.id);
  formReply.addEventListener('submit', function(e){
    e.preventDefault();
  db.collection('reply').doc(doc.id).update({
    header : document.querySelector('#header' + doc.id).value,
    keterangan : document.querySelector('#keterangan' + doc.id).value.replace(/\n\r?/g, '<br/>')
    }).then(() => {
      instance.close();
    })
  })

}

function updateReply(doc){
    let header = doc.data().header;
    let keterangan = doc.data().keterangan;
    document.querySelector('#header-tampilan' + doc.id).innerHTML = header;
    document.querySelector('#keterangan-tampilan' + doc.id).innerHTML = keterangan;
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

function auto_grow(element){
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}
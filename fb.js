/* Firebase সংযোগ (Firestore + Authentication). সাইট ও অ্যাডমিন — দুই জায়গাতেই লোড হয়।
   ডেটা থাকে "people" কালেকশনে। পড়া সবার জন্য খোলা; লেখা শুধু লগইন করা অ্যাডমিন। */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

var app = initializeApp(window.MH_FB_CONFIG), db = getFirestore(app), auth = getAuth(app);
var COL = 'people';
function clean(p) {            // only known fields, no undefined
  var o = {}; ['kind', 'name', 'profession', 'designation', 'department', 'photo'].forEach(function (k) { o[k] = String(p[k] == null ? '' : p[k]); });
  o.order = Number(p.order) || 0;
  if (p.kind === 'student') { o.cls = Number(p.cls) || 0; o.roll = Number(p.roll) || 0; }
  if (p.placeholder) o.placeholder = true;
  return o;
}
window.MH_FB = {
  list: function () { return getDocs(collection(db, COL)).then(function (s) { return s.docs.map(function (d) { var x = d.data(); x.id = d.id; return x; }); }); },
  save: function (p) {
    var id = p.id || doc(collection(db, COL)).id;
    return setDoc(doc(db, COL, id), clean(p)).then(function () { return id; });
  },
  remove: function (id) { return deleteDoc(doc(db, COL, id)); },
  importMany: function (rows) {          // batches of 400
    var chunks = []; for (var i = 0; i < rows.length; i += 400) chunks.push(rows.slice(i, i + 400));
    return chunks.reduce(function (pr, ch) {
      return pr.then(function () { var b = writeBatch(db); ch.forEach(function (p) { b.set(doc(db, COL, p.id), clean(p)); }); return b.commit(); });
    }, Promise.resolve());
  },
  login: function (e, p) { return signInWithEmailAndPassword(auth, e, p); },
  logout: function () { return signOut(auth); },
  onAuth: function (cb) { return onAuthStateChanged(auth, cb); },
  user: function () { return auth.currentUser; }
};
window.dispatchEvent(new Event('mh:fb-ready'));

import Navigo from 'navigo';
let root = null;
let useHash = true;
let hash = '#';
const router = new Navigo(root, useHash, hash);

export default router;
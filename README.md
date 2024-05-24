## <p align="center"><b>Welcome to AYSHABOT</b></p>
------------

AYSHABOT adalah sistem WhatsApp Chatbot yang dikembangkan untuk mempermudah masyarakat dalam menerima layanan informasi di Rumah Sakit Islam Aysha Cibinong Bogor.

## 🔥 PROJECT : API-AYSHABOT
Backend System Restfull API for Website Knowledge Base Chatbot

## 💻 Features
- ??
- ??
- ??
- ??

## 💻 Clone Repository
```bash
git clone https://github.com/AYSHA-DEV-POLBAN/ayshabot-central-be.git
```
```bash
cd ayshabot-central-be
```

## 🏃‍♂️ Installation

Install dependencies
```bash
  npm install
```

If a failure occurs in the installation process, please download the node module at the following URL
```http
  https://drive.google.com/drive/folders/113bDLJlQpOZqtIyxfWFycZiGs--x_YhO
```

Run migration
```bash
  npm run migrate
```

Start the server
```bash
  npm start
```
or start the server env development
```bash
  npm run dev
```
or start the server env production
```bash
  npm run prod
```

## 💻 Push Repository
```bash
git add .
```
```bash
git commit -m "<FIX> Authentication : pembetulan error bagian jwt signin"
```
```bash
git push -u origin [branch-name]
```

Format Pesan Commit : 
```bash
<type> [scope] : [description]
```

Type : 
- DEL : commit untuk menghapus folder, file, atau source code.
- FEAT : commit untuk penambahan fitur.
- FIX : commit untuk memperbaiki penamaan function/variabel clean code.
- IMPROVE : commit jika adanya improvisasi
- TEST : commit untuk unit testing.

## 🤨 Keterangan
Branch
- Master : Branch ini merupakan branch yang akan menghubungkan ke production server
- Develop : Branch ini merupakan branch yang akan menghubungkan ke staging

## 🛜 API Reference

#### Get all items
```http
  GET /api/items
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item
```http
  GET /api/items/${id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)
Takes two numbers and returns the sum.

## 👤 Developer / Colleger / Mahasiswa/i
- [211511034 Bagus Nugroho](https://github.com/brada1604)
- [211511051 Nazwa Fitriyani Zahra](https://github.com/nazwaaca)
- [211511054 Reyna Nur Rahmah Setiana](https://github.com/Reynanur)

## 👤 Supervisor / Dosen Pembimbing
- Bapak Ade Chandra Nugraha, S.Si., M.T.
- Bapak Irwan Setiawan, S.Si., M. T.

## 🏢 Partner
- Rumah Sakit Islam Aysha Cibinong Bogor
  
------------

<p align="center"><b>Made with ❤️ by Kelompok Tugas Akhir 205 Jurusan Teknik Komputer dan Informatika Politeknik Negeri Bandung 2024</b></p>



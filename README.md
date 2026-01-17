# Agri Field Designer

> Scroll down for English

## Tarımsal Alan Model Yerleştirme Aracı

Agri Field Designer, tarım simülasyonları ve 3D ortamlar için model yerleştirmeyi kolaylaştıran web tabanlı bir araçtır. Gazebo/ROS uyumlu XML formatında çıktı üretir ve Three.js ile 3D önizleme sunar.

---

## Özellikler

### Model Yapılandırması
- **Model URI ve İsimlendirme:** Gazebo model URI'si ve benzersiz model isimleri tanımlama
- **Boyut Kontrolü:** X, Y, Z eksenlerinde model boyutlarını özelleştirme
- **Pozisyon Ayarları:** Başlangıç konumu ve grid düzeni için hassas koordinat girişi

### Grid ve Dağılım
- **Çoklu Eksen Tekrarı:** X, Y, Z eksenlerinde bağımsız tekrar sayıları
- **Mesafe Ayarları:** Modeller arası boşluk kontrolü
- **Rastgele Sapma:** Doğal görünüm için pozisyon varyasyonu
- **Rotasyon Sapması:** Roll, Pitch, Yaw eksenlerinde rastgele döndürme (0-360 derece)

### 3D Görselleştirme
- **Gerçek Zamanlı Önizleme:** Three.js ile interaktif 3D görünüm
- **Kamera Kontrolleri:**
  - Sol tık + sürükle: Kamerayı döndürme
  - Sağ tık / Shift + Sol tık: Kamerayı kaydırma
  - Scroll: Yakınlaştırma/Uzaklaştırma
- **Dinamik Viewport:** Responsive tasarım ve tam ekran destek

### Çıktı ve Dışa Aktarma
- **XML Formatı:** Gazebo/ROS uyumlu `<include>` etiketleri
- **Tek Tık Kopyalama:** XML çıktısını panoya kopyalama
- **Otomatik Güncelleme:** Parametre değişikliklerinde anlık yeniden oluşturma

### Kullanıcı Arayüzü
- **Çoklu Dil Desteği:** Türkçe ve İngilizce arayüz
- **Kompakt Tasarım:** Optimize edilmiş panel düzeni
- **Hassas Kontroller:** Step değerleri ile doğru giriş

---

## Kurulum ve Kullanım

### Yerel Kullanım
1. Projeyi indirin veya klonlayın
2. `index.html` dosyasını bir web tarayıcısında açın
3. Internet bağlantısı gereklidir (Three.js CDN)

### Çevrimiçi Kullanım
Tarayıcınızdan doğrudan erişim için web sunucusunda barındırın.

---

## Kullanım Kılavuzu

### Temel Adımlar
1. **Model Bilgilerini Girin:** URI ve model adını tanımlayın
2. **Boyutları Ayarlayın:** Model boyutlarını metre cinsinden girin
3. **Grid Parametrelerini Belirleyin:**
   - Başlangıç konumu
   - Tekrar sayıları (her eksen için)
   - Nesneler arası mesafe
4. **Varyasyon Ekleyin (Opsiyonel):**
   - Pozisyon sapması
   - Rotasyon sapması
5. **Önizleme ve Oluşturma:** 3D görünümü kontrol edin
6. **XML'i Kopyalayın:** Çıktıyı simülasyon ortamınıza aktarın

### Parametre Açıklamaları

**Model Boyutları**
- Genişlik (X), Yükseklik (Y), Derinlik (Z) metre cinsinden
- Minimum değer: 0.1m

**Başlangıç Konumu**
- Grid'in başlangıç noktası (X, Y, Z koordinatları)
- Negatif değerler desteklenir

**Tekrar Miktarı**
- Her eksende kaç model yerleştirileceği
- Minimum: 1, maksimum sınır yoktur

**Mesafe (Aralık)**
- İki model merkezi arasındaki mesafe (metre)
- Her eksen için bağımsız ayarlanabilir

**Sapma Payı**
- Her modele eklenen rastgele pozisyon varyasyonu
- 0 = düzenli grid, >0 = rastgele dağılım
- Değer metre cinsindendir (±sapma)

**Rotasyon Sapması**
- Roll, Pitch, Yaw için rastgele döndürme
- Derece cinsinden (0-360)
- 0 = rotasyon yok, 360 = tam rastgele

### 3D Görünüm Kontrolleri
- **Döndürme:** Sol fare tuşu ile sürükleyin
- **Kaydırma:** Sağ fare tuşu veya Shift+Sol tuş ile sürükleyin
- **Zoom:** Fare tekerleği ile yakınlaştırın/uzaklaştırın

---

## XML Çıktı Formatı

```xml
<include>
  <uri>model://big_plant</uri>
  <name>big_plant_01</name>
  <pose>0.000000 0.000000 0.000000 0.000000 0.000000 0.000000</pose>
</include>
```

Pose formatı: `X Y Z Roll Pitch Yaw` (pozisyon metre, açılar radyan)

---

## Teknik Detaylar

### Kullanılan Teknolojiler
- **HTML5/CSS3:** Arayüz ve layout
- **Vanilla JavaScript:** Uygulama mantığı
- **Three.js (r128):** 3D görselleştirme
- **LocalStorage:** Dil tercihi saklama

### Tarayıcı Gereksinimleri
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- WebGL desteği
- JavaScript etkin

### Performans Notları
- Çok sayıda model (>1000) 3D render performansını etkileyebilir
- XML çıktısı model sayısından bağımsız olarak hızlı üretilir
- Tarayıcı hafızası sınırlaması yoktur

---

## Geliştirme

### Dosya Yapısı
```
AgriFieldDesigner/
├── index.html          # Ana HTML dosyası
├── style.css           # Stil tanımlamaları
├── script.js           # Uygulama mantığı
├── README.md           # Dokümantasyon
└── LICENSE             # Lisans bilgisi
```

### Özelleştirme
- Dil çevirileri: `script.js` içindeki `translations` objesi
- Varsayılan değerler: `index.html` içindeki input `value` özellikleri
- Renk teması: `style.css` içindeki color değişkenleri

---

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

---

## İletişim ve Destek

Hata bildirimleri, öneriler veya sorularınız için GitHub Issues kullanın.

---

# Agri Field Designer (English)

## Agricultural Field Model Placement Tool

Agri Field Designer is a web-based tool for simplifying model placement in agricultural simulations and 3D environments. It generates Gazebo/ROS compatible XML output with Three.js 3D preview.

---

## Features

### Model Configuration
- **Model URI and Naming:** Define Gazebo model URI and unique model names
- **Size Control:** Customize model dimensions on X, Y, Z axes
- **Position Settings:** Precise coordinate input for start position and grid layout

### Grid and Distribution
- **Multi-axis Repetition:** Independent repeat counts on X, Y, Z axes
- **Distance Settings:** Control spacing between models
- **Random Deviation:** Position variation for natural appearance
- **Rotation Deviation:** Random rotation on Roll, Pitch, Yaw axes (0-360 degrees)

### 3D Visualization
- **Real-time Preview:** Interactive 3D view with Three.js
- **Camera Controls:**
  - Left click + drag: Rotate camera
  - Right click / Shift + Left click: Pan camera
  - Scroll: Zoom in/out
- **Dynamic Viewport:** Responsive design with full-screen support

### Output and Export
- **XML Format:** Gazebo/ROS compatible `<include>` tags
- **One-click Copy:** Copy XML output to clipboard
- **Auto-update:** Instant regeneration on parameter changes

### User Interface
- **Multi-language Support:** Turkish and English interface
- **Compact Design:** Optimized panel layout
- **Precise Controls:** Accurate input with step values

---

## Installation and Usage

### Local Usage
1. Download or clone the project
2. Open `index.html` in a web browser
3. Internet connection required (Three.js CDN)

### Online Usage
Host on a web server for direct browser access.

---

## Usage Guide

### Basic Steps
1. **Enter Model Information:** Define URI and model name
2. **Set Dimensions:** Enter model size in meters
3. **Configure Grid Parameters:**
   - Start position
   - Repeat counts (per axis)
   - Distance between objects
4. **Add Variation (Optional):**
   - Position deviation
   - Rotation deviation
5. **Preview and Generate:** Check 3D view
6. **Copy XML:** Transfer output to your simulation environment

### Parameter Descriptions

**Model Size**
- Width (X), Height (Y), Depth (Z) in meters
- Minimum value: 0.1m

**Start Position**
- Grid starting point (X, Y, Z coordinates)
- Negative values supported

**Repeat Count**
- Number of models to place on each axis
- Minimum: 1, no maximum limit

**Distance (Gap)**
- Distance between model centers (meters)
- Configurable independently per axis

**Deviation**
- Random position variation added to each model
- 0 = regular grid, >0 = random distribution
- Value in meters (±deviation)

**Rotation Deviation**
- Random rotation for Roll, Pitch, Yaw
- In degrees (0-360)
- 0 = no rotation, 360 = fully random

### 3D View Controls
- **Rotate:** Drag with left mouse button
- **Pan:** Drag with right mouse button or Shift+Left
- **Zoom:** Use mouse wheel to zoom in/out

---

## XML Output Format

```xml
<include>
  <uri>model://big_plant</uri>
  <name>big_plant_01</name>
  <pose>0.000000 0.000000 0.000000 0.000000 0.000000 0.000000</pose>
</include>
```

Pose format: `X Y Z Roll Pitch Yaw` (position in meters, angles in radians)

---

## Technical Details

### Technologies Used
- **HTML5/CSS3:** Interface and layout
- **Vanilla JavaScript:** Application logic
- **Three.js (r128):** 3D visualization
- **LocalStorage:** Language preference storage

### Browser Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- WebGL support
- JavaScript enabled

### Performance Notes
- Large model counts (>1000) may affect 3D render performance
- XML output generation is fast regardless of model count
- No browser memory limitations

---

## Development

### File Structure
```
AgriFieldDesigner/
├── index.html          # Main HTML file
├── style.css           # Style definitions
├── script.js           # Application logic
├── README.md           # Documentation
└── LICENSE             # License information
```

### Customization
- Language translations: `translations` object in `script.js`
- Default values: input `value` attributes in `index.html`
- Color theme: color values in `style.css`

---

## License

This project is licensed under the MIT License.

---

## Contact and Support

Use GitHub Issues for bug reports, suggestions, or questions.
AgriFieldDesigner is a tool for creating virtual field layouts and designs for agricultural simulations. It allows users to define models, spacing, and positioning for field planning in Gazebo simulations.

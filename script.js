// Daten laden oder initialisieren
let db = JSON.parse(localStorage.getItem('carProData')) || {
    total: 0,
    personen: 0,
    stillgelegt: 0,
    anzeigen: 0,
    bussen: 0,
    herkunft: { CH: 0, EU: 0, Drittstaat: 0 },
    logs: []
};

// Aktuelles Datum anzeigen
document.getElementById('date-now').innerText = new Date().toLocaleDateString('de-CH');

// UI initialisieren
updateDisplay();

// Formular-Logik
document.getElementById('control-form').onsubmit = function(e) {
    e.preventDefault();

    const entry = {
        ts: new Date().toLocaleString('de-CH'),
        herkunft: document.getElementById('herkunft').value,
        personen: parseInt(document.getElementById('personen-anzahl').value) || 0,
        stillgelegt: document.getElementById('stillgelegt').checked,
        anzeigeTech: document.getElementById('anzeige-tech').checked,
        anzeigeRecht: document.getElementById('anzeige-recht').checked,
        busse: document.getElementById('busse').checked,
        notizen: document.getElementById('notizen').value.trim()
    };

    // Statistik berechnen
    db.total++;
    db.personen += entry.personen;
    db.herkunft[entry.herkunft]++;
    if (entry.stillgelegt) db.stillgelegt++;
    if (entry.anzeigeTech || entry.anzeigeRecht) db.anzeigen++;
    if (entry.busse) db.bussen++;
    
    db.logs.push(entry);

    // Speichern & Update
    localStorage.setItem('carProData', JSON.stringify(db));
    updateDisplay();
    this.reset();
};

// Export-Funktion
document.getElementById('btn-export').onclick = function() {
    if (db.logs.length === 0) return alert("Keine Daten vorhanden.");
    
    let csv = "Zeitstempel;Herkunft;Personen;Stillgelegt;Anz_Tech;Anz_Recht;Busse;Notizen\n";
    db.logs.forEach(l => {
        csv += `${l.ts};${l.herkunft};${l.personen};${l.stillgelegt};${l.anzeigeTech};${l.anzeigeRecht};${l.busse};${l.notizen.replace(/;/g, ",")}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Carkontrolle_Export_${new Date().toLocaleDateString()}.csv`;
    a.click();
};

// Reset-Funktion
document.getElementById('btn-reset').onclick = function() {
    if (confirm("Möchtest du wirklich alle Daten löschen?")) {
        localStorage.removeItem('carProData');
        location.reload();
    }
};

function updateDisplay() {
    document.getElementById('stat-total').innerText = db.total;
    document.getElementById('stat-personen').innerText = db.personen;
    document.getElementById('stat-anzeigen').innerText = db.anzeigen;
    document.getElementById('stat-stillgelegt').innerText = db.stillgelegt;
    
    document.getElementById('count-ch').innerText = db.herkunft.CH;
    document.getElementById('count-eu').innerText = db.herkunft.EU;
    document.getElementById('count-dritt').innerText = db.herkunft.Drittstaat;
}

const fs = require('fs');

try {
    const raw = JSON.parse(fs.readFileSync('raw_breeds.json', 'utf8'));
    const breeds = raw.map(b => {
        // Size logic
        let size = 'medium';
        if (b.weight && b.weight.imperial) {
            const parts = b.weight.imperial.split('-').map(s => parseInt(s.trim()));
            const avg = parts.reduce((a, c) => a + c, 0) / parts.length;
            if (avg < 12) size = 'toy';
            else if (avg < 25) size = 'small';
            else if (avg < 50) size = 'medium';
            else if (avg < 90) size = 'large';
            else size = 'giant';
        }

        // Description logic
        let description = b.description || '';
        if (!description) {
            description = `${b.name} is a ${size} dog`;
            if (b.origin) description += ` from ${b.origin}`;
            description += '.';
            if (b.bred_for) description += ` It was bred for ${b.bred_for}.`;
            if (b.temperament) description += ` Known for being ${b.temperament}.`;
        }

        return {
            id: b.id.toString(),
            name: b.name,
            alt_names: [],
            origin: b.origin || 'Unknown',
            size: size,
            coat_length: 'short', // Default
            coat_type: 'smooth', // Default
            colors: [], // Default
            ears: 'droopy', // Default
            tail: 'straight', // Default
            temperament: b.temperament ? b.temperament.split(',').map(t => t.trim()) : [],
            description: description
        };
    });

    fs.writeFileSync('src/assets/breeds.json', JSON.stringify(breeds, null, 2));
    console.log(`Processed ${breeds.length} breeds.`);
} catch (e) {
    console.error(e);
}

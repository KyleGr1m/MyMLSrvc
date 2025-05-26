const fileInput = document.getElementById('fileInput');
let allAccounts = [];

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const text = e.target.result;
        processFile(text);
        showPaginatedData(1);
    };
    
    reader.readAsText(file);
});

function processFile(text) {
    const lines = text.split('\n');
    allAccounts = lines.map(line => {
        if (!line) return null;
        const [emailPass, level, name, uid, rank, country, date, banned] = line.split(' | ');
        const [email, password] = emailPass.split(':');
        
        return {
            email: email.trim(),
            password: password.split(' ')[0].trim(),
            uid: uid.split(': ')[1].split(' ')[0].trim(),
            fullInfo: line,
            checked: false
        };
    }).filter(acc => acc !== null);
}

function showPaginatedData(page) {
    const start = (page - 1) * 30;
    const end = start + 30;
    const pageData = allAccounts.slice(start, end);
    
    const html = `
        <div class="header">
            <h2>Accounts (Page ${page})</h2>
            <div class="pagination">
                ${page > 1 ? `<button onclick="showPaginatedData(${page-1})">Previous</button>` : ''}
                ${end < allAccounts.length ? `<button onclick="showPaginatedData(${page+1})">Next</button>` : ''}
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>UID</th>
                    <th>Actions</th>
                    <th>Checked</th>
                </tr>
            </thead>
            <tbody>
                ${pageData.map((acc, i) => `
                    <tr class="${acc.checked ? 'checked' : ''}">
                        <td>${start + i + 1}</td>
                        <td>${acc.email}</td>
                        <td>${acc.password}</td>
                        <td>${acc.uid}</td>
                        <td class="actions">
                            <button onclick="copyToClipboard('${acc.email}')">Copy Gmail</button>
                            <button onclick="copyToClipboard('${acc.password}')">Copy Pass</button>
                            <button onclick="copyToClipboard('${acc.uid}')">Copy UID</button>
                            <button onclick="copyToClipboard(\`${acc.fullInfo}\`)">Full Info</button>
                        </td>
                        <td><button onclick="toggleChecked(${start + i})">${acc.checked ? '✓' : 'Mark'}</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('content').innerHTML = html;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

function toggleChecked(index) {
    allAccounts[index].checked = !allAccounts[index].checked;
    showPaginatedData(Math.floor(index / 30) + 1);
}

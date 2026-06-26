import re

with open('src/pages/OperatorHelpDesk.jsx', 'r') as f:
    content = f.read()

# 1. Add selectedGate state
content = content.replace(
    'const [activeRequestCount, setActiveRequestCount] = useState(2) // 0, 1, or 2 for demonstration',
    'const [activeRequestCount, setActiveRequestCount] = useState(2) // 0, 1, or 2 for demonstration\n  const [selectedGate, setSelectedGate] = useState(1)'
)

# 2. Extract Manual Auth Panel (from dual request UI)
# It starts at {/* RIGHT COLUMN: MANUAL AUTHORIZATION */} inside activeRequestCount === 2
# Let's find the exact string.
manual_auth_start = content.find('                {/* RIGHT COLUMN: MANUAL AUTHORIZATION */}')
manual_auth_end = content.find('              </div>\n\n              {/* ALERT BOTTOM BAR */}')
manual_auth_content = content[manual_auth_start:manual_auth_end].strip()

# 3. Extract Database RFID Panel
db_rfid_start = content.find('                {/* RIGHT COLUMN: DATABASE RFID DATA */}')
db_rfid_end = content.find('              </div>\n\n              {/* ALERT BOTTOM BAR */}', manual_auth_end + 10)
db_rfid_content = content[db_rfid_start:db_rfid_end].strip()

# Now we need to insert these functions before the return
functions = f"""
  const renderDualManualAuth = () => (
{manual_auth_content}
  );

  const renderDualDatabaseRFID = () => (
{db_rfid_content}
  );
"""

content = content.replace('  return (\n', functions + '\n  return (\n')

# 4. Replace Card 1
card1_start = content.find('            {/* CARD 1 (GATE 01) */}\n            <div className="flex-1 flex flex-col border-[5px] 2xl:border-[6px] border-[#2EAFF9] p-5 2xl:p-7 bg-[#1E2022] overflow-hidden min-w-0">')
card1_end = content.find('                {/* RIGHT COLUMN: MANUAL AUTHORIZATION */}', card1_start)
card1_prefix = content[card1_start:card1_end]

new_card1_prefix = card1_prefix.replace(
    '<div className="flex-1 flex flex-col border-[5px] 2xl:border-[6px] border-[#2EAFF9] p-5 2xl:p-7 bg-[#1E2022] overflow-hidden min-w-0">',
    '<div className={`flex-1 flex flex-col p-5 2xl:p-7 bg-[#1E2022] overflow-hidden min-w-0 transition-all duration-300 cursor-pointer ${selectedGate === 1 ? \'border-[5px] 2xl:border-[6px] border-[#2EAFF9]\' : \'border border-[#444841] opacity-80 hover:opacity-100\'}`} onClick={() => setSelectedGate(1)}>'
)

content = content[:card1_start] + new_card1_prefix + '                {selectedGate === 1 ? renderDualManualAuth() : renderDualDatabaseRFID()}\n' + content[manual_auth_end:]

# 5. Replace Card 2
# We have to re-find db_rfid_start because content indices changed
card2_start = content.find('            {/* CARD 2 (GATE 02) */}\n            <div className="flex-1 flex flex-col p-5 2xl:p-7 bg-[#1E2022] overflow-hidden min-w-0">')
card2_end = content.find('                {/* RIGHT COLUMN: DATABASE RFID DATA */}', card2_start)
card2_prefix = content[card2_start:card2_end]

new_card2_prefix = card2_prefix.replace(
    '<div className="flex-1 flex flex-col p-5 2xl:p-7 bg-[#1E2022] overflow-hidden min-w-0">',
    '<div className={`flex-1 flex flex-col p-5 2xl:p-7 bg-[#1E2022] overflow-hidden min-w-0 transition-all duration-300 cursor-pointer ${selectedGate === 2 ? \'border-[5px] 2xl:border-[6px] border-[#2EAFF9]\' : \'border border-[#444841] opacity-80 hover:opacity-100\'}`} onClick={() => setSelectedGate(2)}>'
)

# db_rfid_end is now different, let's find it
db_rfid_end_new = content.find('              </div>\n\n              {/* ALERT BOTTOM BAR */}', card2_end)

content = content[:card2_start] + new_card2_prefix + '                {selectedGate === 2 ? renderDualManualAuth() : renderDualDatabaseRFID()}\n' + content[db_rfid_end_new:]


with open('src/pages/OperatorHelpDesk.jsx', 'w') as f:
    f.write(content)

print("Done")

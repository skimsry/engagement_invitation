/**
 * Google Apps Script for Engagement Invitation CRUD & RSVP
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1Dywg4dhXeyF-21qwhA1PAQqeV-VgPOC8NiUtwNzd0QM
 */

const SPREADSHEET_ID = "1Dywg4dhXeyF-21qwhA1PAQqeV-VgPOC8NiUtwNzd0QM";

function getOrCreateSheet() {
  let ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {}
  
  if (!ss) {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (err) {
      throw new Error("Cannot open spreadsheet. Check SPREADSHEET_ID or permissions: " + err.toString());
    }
  }
  
  // Use first sheet tab
  let sheet = ss.getSheets()[0];
  
  // If sheet is completely empty, create default headers
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "id",
      "name",
      "rsvp",
      "guestCount",
      "message",
      "telegram_link",
      "web_link",
      "createdAt",
      "updatedAt"
    ]);
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold");
  }
  return sheet;
}

// Helper to find column index by header name (case-insensitive)
function getHeaderMap(sheet) {
  const headerRow = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  const map = {};
  for (let col = 0; col < headerRow.length; col++) {
    const title = String(headerRow[col] || "").trim().toLowerCase();
    if (title) map[title] = col + 1; // 1-indexed for Sheets
  }
  // Ensure default indices if headers missing
  if (!map["id"]) map["id"] = 1;
  if (!map["name"]) map["name"] = 2;
  if (!map["rsvp"]) map["rsvp"] = 3;
  if (!map["guestcount"] && !map["guest_count"]) map["guestcount"] = 4;
  if (!map["message"]) map["message"] = 5;
  if (!map["telegram_link"] && !map["telegram"]) map["telegram_link"] = 6;
  if (!map["web_link"] && !map["web"]) map["web_link"] = 7;
  if (!map["createdat"] && !map["created_at"]) map["createdat"] = 8;
  if (!map["updatedat"] && !map["updated_at"]) map["updatedat"] = 9;
  return map;
}

// Generate unique 6-digit random ID
function generateUniqueId(sheet) {
  const data = sheet.getDataRange().getValues();
  const existingIds = new Set();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) existingIds.add(String(data[i][0]).trim());
  }
  
  let newId = "";
  let attempts = 0;
  do {
    newId = String(Math.floor(100000 + Math.random() * 900000));
    attempts++;
  } while (existingIds.has(newId) && attempts < 10000);
  
  return newId;
}

// GET Request Handler
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const headers = getHeaderMap(sheet);
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "";
    const id = (e && e.parameter && e.parameter.id) ? String(e.parameter.id).trim() : "";
    
    // Ping/test version check
    if (action === "version" || action === "ping") {
      return respondJson({ success: true, version: "2.0-crud", spreadsheetId: SPREADSHEET_ID });
    }

    // Action 1: List all invitations for CRUD UI
    if (action === "list" || action === "readAll" || (!id && !action)) {
      const data = sheet.getDataRange().getValues();
      const list = [];
      const idCol = (headers["id"] || 1) - 1;
      const nameCol = (headers["name"] || 2) - 1;
      const rsvpCol = (headers["rsvp"] || 3) - 1;
      const countCol = (headers["guestcount"] || headers["guest_count"] || 4) - 1;
      const msgCol = (headers["message"] || 5) - 1;
      const tgCol = (headers["telegram_link"] || headers["telegram"] || 6) - 1;
      const webCol = (headers["web_link"] || headers["web"] || 7) - 1;
      const createdCol = (headers["createdat"] || headers["created_at"] || 8) - 1;
      const updatedCol = (headers["updatedat"] || headers["updated_at"] || 9) - 1;

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row[idCol]) continue;
        const rowId = String(row[idCol]).trim();
        list.push({
          id: rowId,
          name: row[nameCol] || "",
          rsvp: row[rsvpCol] || "Pending",
          guestCount: String(row[countCol] || "1"),
          message: row[msgCol] || "",
          telegram_link: row[tgCol] || ("https://t.me/engagement_invitation_bot/invite?startapp=" + rowId),
          web_link: row[webCol] || ("https://engagement-invitation.sornkimsry96.workers.dev/?guest=" + rowId),
          createdAt: row[createdCol] || "",
          updatedAt: row[updatedCol] || ""
        });
      }
      return respondJson({ success: true, version: "2.0-crud", data: list });
    }
    
    // Action 2: Get single invitation by ID (for guest page)
    if (id) {
      const data = sheet.getDataRange().getValues();
      const idCol = (headers["id"] || 1) - 1;
      const nameCol = (headers["name"] || 2) - 1;
      const rsvpCol = (headers["rsvp"] || 3) - 1;
      const countCol = (headers["guestcount"] || headers["guest_count"] || 4) - 1;
      const msgCol = (headers["message"] || 5) - 1;
      const tgCol = (headers["telegram_link"] || headers["telegram"] || 6) - 1;
      const webCol = (headers["web_link"] || headers["web"] || 7) - 1;

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idCol]).trim() === id) {
          const rowId = String(data[i][idCol]).trim();
          return respondJson({
            found: true,
            id: rowId,
            name: data[i][nameCol] || "",
            rsvp: data[i][rsvpCol] || "Pending",
            guestCount: String(data[i][countCol] || "1"),
            message: data[i][msgCol] || "",
            telegram_link: data[i][tgCol] || ("https://t.me/engagement_invitation_bot/invite?startapp=" + rowId),
            web_link: data[i][webCol] || ("https://engagement-invitation.sornkimsry96.workers.dev/?guest=" + rowId)
          });
        }
      }
      return respondJson({ found: false, message: "ID not found in sheet" });
    }
    
    return respondJson({ found: false, error: "Missing id or valid action" });
  } catch (err) {
    return respondJson({ success: false, error: err.toString() });
  }
}

// POST Request Handler
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const headers = getHeaderMap(sheet);
    let body = {};
    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        body = e.parameter || {};
      }
    } else if (e && e.parameter) {
      body = e.parameter;
    }
    
    const action = body.action || "rsvp";
    
    // CRUD: List all via POST
    if (action === "list" || action === "readAll") {
      return doGet({ parameter: { action: "list" } });
    }
    
    // CRUD: CREATE New Invitation
    if (action === "create") {
      let id = body.id ? String(body.id).trim() : "";
      if (!id) {
        id = generateUniqueId(sheet);
      }
      
      const name = body.name || "";
      const rsvp = body.rsvp || "Pending";
      const guestCount = String(body.guestCount || "1");
      const message = body.message || "";
      const telegram_link = "https://t.me/engagement_invitation_bot/invite?startapp=" + id;
      const web_link = "https://engagement-invitation.sornkimsry96.workers.dev/?guest=" + id;
      const now = new Date().toISOString();
      
      // Determine max columns needed
      const maxCol = Math.max(
        headers["id"] || 1,
        headers["name"] || 2,
        headers["rsvp"] || 3,
        headers["guestcount"] || 4,
        headers["message"] || 5,
        headers["telegram_link"] || 6,
        headers["web_link"] || 7,
        headers["createdat"] || 8,
        headers["updatedat"] || 9
      );
      
      const newRow = new Array(maxCol).fill("");
      newRow[(headers["id"] || 1) - 1] = id;
      newRow[(headers["name"] || 2) - 1] = name;
      newRow[(headers["rsvp"] || 3) - 1] = rsvp;
      newRow[(headers["guestcount"] || headers["guest_count"] || 4) - 1] = guestCount;
      newRow[(headers["message"] || 5) - 1] = message;
      newRow[(headers["telegram_link"] || headers["telegram"] || 6) - 1] = telegram_link;
      newRow[(headers["web_link"] || headers["web"] || 7) - 1] = web_link;
      newRow[(headers["createdat"] || headers["created_at"] || 8) - 1] = now;
      newRow[(headers["updatedat"] || headers["updated_at"] || 9) - 1] = now;
      
      sheet.appendRow(newRow);
      
      return respondJson({
        success: true,
        message: "Created successfully in Google Spreadsheet",
        guest: {
          id: id,
          name: name,
          rsvp: rsvp,
          guestCount: guestCount,
          message: message,
          telegram_link: telegram_link,
          web_link: web_link,
          createdAt: now,
          updatedAt: now
        }
      });
    }
    
    // CRUD: UPDATE Invitation
    if (action === "update") {
      const targetId = String(body.id || "").trim();
      if (!targetId) return respondJson({ success: false, error: "Missing ID for update" });
      
      const data = sheet.getDataRange().getValues();
      const idCol = (headers["id"] || 1) - 1;
      let foundIndex = -1;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idCol]).trim() === targetId) {
          foundIndex = i + 1; // 1-indexed
          break;
        }
      }
      
      if (foundIndex === -1) {
        return respondJson({ success: false, error: "Guest not found" });
      }
      
      if (body.name !== undefined && headers["name"]) sheet.getRange(foundIndex, headers["name"]).setValue(body.name);
      if (body.rsvp !== undefined && headers["rsvp"]) sheet.getRange(foundIndex, headers["rsvp"]).setValue(body.rsvp);
      if (body.guestCount !== undefined && headers["guestcount"]) sheet.getRange(foundIndex, headers["guestcount"]).setValue(body.guestCount);
      if (body.message !== undefined && headers["message"]) sheet.getRange(foundIndex, headers["message"]).setValue(body.message);
      if (headers["updatedat"]) sheet.getRange(foundIndex, headers["updatedat"]).setValue(new Date().toISOString());
      
      return respondJson({ success: true, message: "Updated successfully" });
    }
    
    // CRUD: DELETE Invitation
    if (action === "delete") {
      const targetId = String(body.id || "").trim();
      if (!targetId) return respondJson({ success: false, error: "Missing ID for delete" });
      
      const data = sheet.getDataRange().getValues();
      const idCol = (headers["id"] || 1) - 1;
      let foundIndex = -1;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idCol]).trim() === targetId) {
          foundIndex = i + 1;
          break;
        }
      }
      
      if (foundIndex === -1) {
        return respondJson({ success: false, error: "Guest not found" });
      }
      
      sheet.deleteRow(foundIndex);
      return respondJson({ success: true, message: "Deleted successfully" });
    }
    
    // STANDARD RSVP SUBMISSION (Backward compatibility)
    const targetId = String(body.id || "").trim();
    if (!targetId) {
      return respondJson({ success: false, error: "Missing ID" });
    }
    
    const data = sheet.getDataRange().getValues();
    const idCol = (headers["id"] || 1) - 1;
    let foundIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][idCol]).trim() === targetId) {
        foundIndex = i + 1;
        break;
      }
    }
    
    if (foundIndex !== -1) {
      if (body.rsvp !== undefined && headers["rsvp"]) sheet.getRange(foundIndex, headers["rsvp"]).setValue(body.rsvp);
      if (body.guestCount !== undefined && headers["guestcount"]) sheet.getRange(foundIndex, headers["guestcount"]).setValue(body.guestCount);
      if (body.message !== undefined && headers["message"]) sheet.getRange(foundIndex, headers["message"]).setValue(body.message);
      if (headers["updatedat"]) sheet.getRange(foundIndex, headers["updatedat"]).setValue(new Date().toISOString());
      return respondJson({ success: true, message: "RSVP updated" });
    } else {
      return respondJson({ success: false, error: "Guest not found" });
    }
    
  } catch (err) {
    return respondJson({ success: false, error: err.toString() });
  }
}

function respondJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

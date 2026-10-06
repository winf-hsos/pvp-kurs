-- Filter für word_lesen: macht aus einer Word-Datei kompaktes Markdown.

-- Kommentare und Änderungen der Lehrenden als lesbarer Text im Fließtext
function Span(s)
  if s.classes:includes("comment-start") then
    local text = pandoc.utils.stringify(s.content)
    return pandoc.Str(" [Kommentar " .. (s.attributes.author or "") .. ": " .. text .. "] ")
  elseif s.classes:includes("comment-end") then
    return {}
  elseif s.classes:includes("insertion") then
    return pandoc.Inlines({ pandoc.Str("{+") }) .. s.content .. pandoc.Inlines({ pandoc.Str("+}") })
  elseif s.classes:includes("deletion") then
    return pandoc.Inlines({ pandoc.Str("{-") }) .. s.content .. pandoc.Inlines({ pandoc.Str("-}") })
  end
end

-- Das Inhaltsverzeichnis ist nur ein Feld und trägt nichts bei
function Header(h)
  if h.classes:includes("TOC-Heading") then return {} end
end

-- Quarto legt Tabellen mit Beschriftung in eine einzellige Rahmentabelle
function Table(t)
  local zeilen = {}
  for _, b in ipairs(t.bodies) do
    for _, r in ipairs(b.body) do table.insert(zeilen, r) end
  end
  if #t.head.rows == 0 and #zeilen == 1 and #zeilen[1].cells == 1 then
    return zeilen[1].cells[1].contents
  end
end

## API Endpoints

- `GET /roman/:inputValue` - Convert Arabic number to Roman numeral
- `GET /arabic/:inputValue` - Convert Roman numeral to Arabic number
- `GET /all` - Get all previous conversions
- `DELETE /remove` - Clear all conversion history

```mermaid
sequenceDiagram
    participant Client
    participant ExpressApp
    participant Controller
    participant ConversionService
    participant DBService
    participant MongoDB

    Client->>ExpressApp: GET /roman/:inputValue
    ExpressApp->>Controller: convertToRoman(req, res)
    Controller->>ConversionService: isValidNumber(inputValue)
    alt Invalid input
        Controller-->>ExpressApp: 400 Bad Request
    else Valid input
        Controller->>DBService: getCachedConversion(inputValue, "arabic-to-roman")
        alt Cache hit
            Controller-->>ExpressApp: 200 OK (cached result)
        else Cache miss
            Controller->>ConversionService: arabicToRoman(inputValue)
            Controller->>DBService: saveConversion(inputValue, roman, "arabic-to-roman")
            Controller-->>ExpressApp: 200 OK (new result)
        end
    end
```

```mermaid
sequenceDiagram
    participant Client
    participant ExpressApp
    participant Controller
    participant DBService
    participant MongoDB

    Client->>ExpressApp: GET /all
    ExpressApp->>Controller: getAll(req, res)
    Controller->>DBService: getAllConversions()
    DBService->>MongoDB: Query all conversions
    DBService-->>Controller: Conversion records
    Controller-->>ExpressApp: 200 OK (conversion list)
```

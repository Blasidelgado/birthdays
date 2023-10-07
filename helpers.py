def validate_data(name, month, day):
    if (name == None or month == None or day == None):
        return False

    if (not name.isalpha()):
        return False

    try:
        int(month)
        int(day)
        return True
    
    except:
        return False
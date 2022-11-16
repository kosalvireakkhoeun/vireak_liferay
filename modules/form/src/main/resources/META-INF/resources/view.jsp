<%@ include file="/init.jsp" %>

<form style="margin: auto; width: 1000px;">
  <div class="form-group">
    <h1 style="color:red;">You must complete all the given questions</h1>
    <label for="exampleFormControlInput1">Email address</label>
    <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
  </div>
  <div class="form-group">
    <label for="exampleFormControlSelect1">Example select</label>
    <select class="form-control" id="exampleFormControlSelect1">
      <option >1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </div>
  <div class="form-group">
    <label for="exampleFormControlSelect2">Example multiple select</label>
    <select multiple class="form-control" id="exampleFormControlSelect2">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </div>
  <div class="form-group">
    <label for="exampleFormControlTextarea1">Example textarea</label>
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
    <button type="button" class="btn btn-primary" onclick="myFunction()">Click here to Submit</button>
    <script>
    function myFunction() {
      alert("Thank for taking this survey");
    }
    </script>
  </div>

  	<aui:button-row>
  		<aui:button type="submit" value="Hello"></aui:button>
  		<aui:button type="cancel"></aui:button>
  	</aui:button-row>

<div class="row">
    <div class="col-md-2">
        <div class="form-group input-text-wrapper">
            <label><%=LanguageUtil.get(request,"language")%></label>
        </div>
    </div>
    <div class="col-md-10">
        <aui:select label="" name="languageId">

            <%
            for (Locale curLocale : LanguageUtil.getAvailableLocales()) {
                String curLocaleId = LocaleUtil.toLanguageId(curLocale);
            %>

                <aui:option label="<%= curLocale.getDisplayName(curLocale) %>" lang="<%= LocaleUtil.toW3cLanguageId(curLocale) %>" selected="<%= profile.getLanguage().equals(curLocaleId) %>" value="<%=curLocaleId%>" />

            <%
            }
            %>

       </aui:select>
    </div>
</div>

<div class="row">
    <div class="col-md-2">
        <div class="form-group input-text-wrapper">
            <label><%=LanguageUtil.get(request,"timezone")%></label>
        </div>
    </div>
    <div class="col-md-10">
        <aui:input type="timeZone" name="timeZoneId" value="<%=profile.getTimezone()%>" label=""/>
    </div>
</div>


</form>
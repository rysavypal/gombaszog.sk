require 'net/http'
require 'json'
require 'nokogiri'

class ProgramTag < Liquid::Tag

  def render(context)
    day_l_map = {
      "Monday"    => "Hétfő",
      "Tuesday"   => "Kedd",
      "Wednesday" => "Szerda",
      "Thursday"  => "Csütörtök",
      "Friday"    => "Péntek",
      "Saturday"  => "Szombat",
      "Sunday"    => "Vasárnap",
    }

    res = File.read('_program.json')
    data = JSON.parse(res)

    locations = {}
    data['locations'].each do |d|
      locations[d['id']] = d['name']
    end

    partners = {}
    data['partners'].each do |d|
      partners[d['id']] = d['name']
    end

    datab = {}
    data['events'].each do |d|
      # d keys: created_at management end description visible partner_id image_id updated_at start festival_id shortname location_id id name
      start_date = Time.parse(d['start']).strftime('%Y-%m-%d')
      if d['visible']
        if not datab.has_key? start_date
          datab[start_date] = []
        end
        datab[start_date].push(d)
      end
    end

    @html = Nokogiri::HTML::DocumentFragment.parse ""
    Nokogiri::HTML::Builder.with(@html) do |html|
        html.div.Option("class" => "program") {
          datab.sort.map do |k,v|
            html.div(:class => "program-nap") {
              html.div(:class => "program-datum") { html.text day_l_map[Time.parse(k).strftime('%A')] }
              html.div(:class => "program-tabla") {
                v.sort_by { |bb| bb['start']+bb['end'] }.each do |d|
                  html.div(:class => "program-sor") {
                    html.div(:class => 'program-ido') { html.text "#{Time.parse(d['start']).strftime('%k:%M')} - #{Time.parse(d['end']).strftime('%k:%M')}"}
                    html.div(:class => 'program-nev') { html.text "#{d['name']}" }
                    html.div(:class => 'program-helyszin') { html.text "#{locations[d['location_id']]}" }
                  }
                end
              }
            }
          end
        }
    end
    @html.to_html
  end
  Liquid::Template.register_tag('dyn_program', self)
end
